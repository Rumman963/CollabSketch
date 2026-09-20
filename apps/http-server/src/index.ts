import express from "express";
import { JWT_SECRET , FRONTEND_URL } from "@repo/backend-common/config"
import { UserSchema , SigninSchema , CreateRoomSchema} from "@repo/common/configs"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware.js";
import {prismaClient} from "@repo/db/client"
import bcrypt from "bcrypt";
import cors from "cors";
const PORT = Number(process.env.PORT) || 3003

const app = express();

app.use(cors({ 
  origin:FRONTEND_URL}));

app.use(express.json());

app.post("/signup" , async (req,res)=>{
  const parseSchema = UserSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    })

    return;
  }

  const { password} = parseSchema.data;

  try{
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email:parseSchema.data.email 
      }
    })

    if(existingUser){
      return res.status(409).json({
        message:"User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prismaClient.user.create({
      data: {
        email: parseSchema.data.email,
        password: hashedPassword,   
        name: parseSchema.data.name
      }
    });

    res.json({
      message:"user created successfully"
    })

  } catch(e){
    console.log(e);
    res.status(500).json({
      message:"Something went wrong"
    })
  }

});


app.post("/signin" , async(req,res)=>{

  const parseSchema = SigninSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    });
  }

  

    try{ 
    const existingUser = await prismaClient.user.findUnique({
      where:{
        email:parseSchema.data.email
      }
    })

      if(!existingUser){
      return res.status(401).json({
       message:"Invalid credentials"
     })
  }
      
   const isPasswordCorrect = await bcrypt.compare(parseSchema.data.password, existingUser.password);

   if(!isPasswordCorrect){
             return res.status(401).json({ message: "Invalid credentials" });

        }


  if (!JWT_SECRET) {
      return res.status(500).json({
      message: "JWT secret is not configured"
   });
} 

    const token = jwt.sign({
    userId: existingUser.id} , 
    JWT_SECRET,
   { expiresIn: "1d" }
)


    res.status(200).json({
      message:"Signin Successfully",
      token
    })

  }catch(e){
    console.log(e);
    res.status(500).json({
   message:"Something went wrong"
  })

  }
});



app.post("/room" ,authMiddleware , async (req,res)=>{
  const parseSchema = CreateRoomSchema.safeParse(req.body);
  if (!parseSchema.success) {
    return res.status(400).json({
      message:"Invalid Inputs"
    })

    return
  } 

  const userId = req.userId
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try{

  
  const room = await prismaClient.room.create({
    data:{
      slug:parseSchema.data.name,
      adminId:userId

    }
  })

  res.json({
    roomId:room.id
  })
  } catch(e){

  res.status(500).json({
   message:"room already exists with this name"
  })

  }  

})


app.get("/chats/:roomId" , authMiddleware, async (req,res)=>{
  const roomId =Number(req.params.roomId);
  if (Number.isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid room id" })
  }
try{


  const messages =await prismaClient.chat.findMany({
    where:{
      roomId
    },

    orderBy:{
      id:"asc"
    },

    take:1000,

  })

  res.json({
    messages
  })

}catch(e){
    console.log(e)
    res.status(500).json({ message: "Something went wrong" })
}
  
})

app.get("/room/:slug", authMiddleware, async (req, res) => {
  const { slug } = req.params
  if (typeof slug !== "string") {
    return res.status(400).json({ message: "Invalid room slug" })
  }

  try {
    const room = await prismaClient.room.findUnique({
      where: { slug },
    })

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json({ roomId: room.id })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Something went wrong" })
  }
})

//server is alive checkpoint
app.get("/health", (_req, res) => {
  res.send("ok")
})

app.listen(PORT , 
  ()=> console.log("http server listening on",
     PORT));