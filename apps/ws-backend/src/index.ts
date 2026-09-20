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

    if(parseData.type === "join_room"){

      const user = users.find(x=> x.ws ===ws);

      user?.rooms.push(parseData.roomId);
      console.log("user joined room", roomId, "rooms:", user?.rooms);

    }

    if(parseData.type ==="leave_room"){

      const user = users.find(x=>x.ws === ws);

      if(!user){

        return;

      }

      //user will not recieve message from that specefic room he join earlier

      user.rooms = user.rooms.filter(x=> x !== String(parseData.roomId))

    }

    

    if(parseData.type === "chat"){

      const message = parseData.message;

      await prismaClient.chat.create({

        data:{
          roomId: Number(roomId),
          message,
          userId

        }

      });

      users.forEach(user =>{

        if(user.ws !== ws && user.rooms.includes(roomId)){

          user.ws.send(JSON.stringify({

            type:"chat",

            message:message,

            roomId

             

          }))

        }

      })

    }


  }catch(e){

    console.log("bad messsage" , e)

  } 


  });
});
