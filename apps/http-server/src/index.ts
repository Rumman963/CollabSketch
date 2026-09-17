import express from "express";
import {JWT_SECRET} from "@repo/backend-common/config"
import { UserSchema , SigninSchema , CreateRoomSchema} from "@repo/common"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());

app.post("signup" , (req,res)=>{
  const parseSchema = UserSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    })
  }
    const {email , name , password} = parseSchema.data

  
       res.json({
        message:"user created successfully",
     })


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


