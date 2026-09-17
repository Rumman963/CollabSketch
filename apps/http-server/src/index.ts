import express from "express";
import {JWT_SECRET} from "@repo/backend-common/config"
import { UserSchema , SigninSchema , CreateRoomSchema} from "@repo/common"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware.js";
import {prismaClient} from "@repo/db/client"
import { parse } from "path";

const app = express();
app.use(express.json());

app.post("signup" , async (req,res)=>{
  const parseSchema = UserSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    })

    return;
  }
   
  try{

  await prismaClient.user.create({
   data:{
          email:parseSchema.data?.email,
          password:parseSchema.data?.password,
          name:parseSchema.data?.name
   }
})

       res.json({
        message:"user created successfully",
     })
    }catch(e){
      res.status(411).json({
        message:"User already exists"
      })
    }

});


app.post("/signin" ,authMiddleware, (req,res)=>{

  const parseSchema = SigninSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    });
      
    return;
  }

  const {email , password} = parseSchema.data;


  if (!JWT_SECRET) {
  return res.status(500).json({
     message: "JWT secret is not configured"
     });

  } 
  
  const token = jwt.sign({
    userId: req.userId
} , JWT_SECRET)


   res.json({
    token
   })
  
 
});



app.post("/room" ,authMiddleware , async (req,res)=>{
  const parseSchema = CreateRoomSchema.safeParse(req.body);
  if (!parseSchema.success) {
    return res.status(400).json({
      message:"Invalid Inputs"
    })

    return
  } 


  res.json({
    roomId:123
  })

})


app.listen(3003);


