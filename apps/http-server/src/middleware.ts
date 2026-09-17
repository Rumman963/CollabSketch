import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import type {NextFunction, Request , Response} from 'express';



export function authMiddleware(req:Request , res:Response , next:NextFunction){
    const authHeaders = req.headers.authorization;
    if(!authHeaders ||  !authHeaders.startsWith('Bearer ')){
        return res.status(401).json({
            message:"No token provided"
        })
    }
    
    const token = authHeaders.split(' ')[1]
    
    if(!token){
        return res.status(401).json({
            message:"No token provided"
        })
    }


    try{
        const decoded = jwt.verify(token , JWT_SECRET);

        if(decoded.userId){
            req.userId = decoded.userId;

        }else{
            return res.status(403).json({
                message:"invalid token"
            })
        }

        next();


    }catch(e){
        return res.status(403).json({
        message: "Invalid or expired token"
    });

    }
}