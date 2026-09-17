import express from "express";
import {JWT_SECRET} from "@repo/backend-common/config"
import { UserSchema , SigninSchema , CreateRoomSchema} from "@repo/common"
import jwt from "jsonwebtoken"

const app = express();
app.use(express.json());

app.post("signup" , async (req,res)=>{
  const parseSchema = UserSchema.safeParse(req.body);
  if(!parseSchema.success){
    return res.status(400).json({
      message:"Invalid credentials"
    })
  }
    const {email , name , password} = parseSchema.data

    try{
      const existingUser = await UserModel.findOne({email});
      
      if(existingUser){
        return res.status(409).json({
          message:"user already exists"
        })
      }

      const dbUser = await UserModel.create({
        email,
        name,
        password
      });


      const token = jwt.sign({
        userId:dbUser._id
      } , JWT_SECRET)

       res.json({
        message:"user created successfully",
        token:token
     })



    }catch(error){
      res.status(500).json({ message: "Something went wrong" });

    }


});










app.listen(3003);
