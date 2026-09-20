import { WebSocketServer, type WebSocket as WsWebSocket } from "ws";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"
import {prismaClient}  from "@repo/db/client"

const wss = new WebSocketServer({ port: 8000 });

//Global Variable to store users array
interface User {
  ws:WsWebSocket,
  rooms:string[],
  userId:string
}


const users: User[] = []

function checkUser(token:string): string | null {

try{
  const decoded = jwt.verify(token , JWT_SECRET);

  if(typeof decoded == "string"){
    return null;
  }

  if(!decoded || !decoded.userId){
    return null;
  }
return decoded.userId;

}catch(e){
  return null;
} 

return null

}

wss.on("connection", function connection(ws , request) {
  const url = request.url;
  if(!url){
    return;
  }

const queryParams = new URLSearchParams(url.split('?')[1]);
const token = queryParams.get('token') || ""
const userId = checkUser(token);

if(userId == null){
  ws.close();
  return null
}
  
 
users.push({
  userId,
  rooms:[],
  ws
});

ws.on("close" , ()=>{
  const i = users.findIndex(u=> u.ws === ws)
   if(i !== -1) users.splice(i,1);
})



  ws.on("message", async function message(data) {
  try{

    const parseData = JSON.parse(data as unknown as string);

    const roomId = String(parseData.roomId);

  if (parseData.type === "join_room") {
  const room = await prismaClient.room.findUnique({
    where: { id: Number(roomId) },
  });
  if (!room) return;

  const user = users.find(x => x.ws === ws);
  if (user && !user.rooms.includes(roomId)) {
    user.rooms.push(roomId);
  }

  ws.send(JSON.stringify({
    type: "role",
    roomId,
    isAdmin: room.adminId === userId,
    slug: room.adminId === userId ? room.slug : null,
  }));
}

    if(parseData.type ==="leave_room"){

      const user = users.find(x=>x.ws === ws);

      if(!user){

        return;

      }

      user.rooms = user.rooms.filter(x=> x !== String(parseData.roomId))

    }

    

    if(parseData.type === "chat"){

      users.forEach(user =>{

        if(user.ws !== ws && user.rooms.includes(roomId)){

          user.ws.send(JSON.stringify({

            type:"chat",

            message:parseData.message,

            roomId

             

          }))



        }

      })

    await prismaClient.chat.create({
    data: { roomId: Number(roomId), message: parseData.message, userId },
     });

    }

  if (parseData.type === "erase") {


  users.forEach(u => {
    if (u.ws !== ws && u.rooms.includes(roomId)) {
      u.ws.send(JSON.stringify({ type: "erase", message: parseData.message, roomId }));
    }
  });

   await prismaClient.chat.deleteMany({
    where: { roomId: Number(roomId), message: parseData.message },
  });

}

if (parseData.type === "clear") {
  const user = users.find(x => x.ws === ws);
  if (!user?.rooms.includes(roomId)) return;

  const room = await prismaClient.room.findUnique({
    where: { id: Number(roomId) },
  });


  if (!room || room.adminId !== userId) return; // only the creator may clear for everyone

  await prismaClient.chat.deleteMany({ where: { roomId: Number(roomId) } });

  users.forEach(u => {
    if (u.ws !== ws && u.rooms.includes(roomId)) {
      u.ws.send(JSON.stringify({ type: "clear", roomId }));
    }
  });
}


  }catch(e){

    console.log("bad messsage" , e)

  } 


  });
});
