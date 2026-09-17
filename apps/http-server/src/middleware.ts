import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import type { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeaders = req.headers.authorization;

    if (!authHeaders) {
        return res.status(401).json({
            message: "Authorization header is required"
        });
    }

   if(!JWT_SECRET){
      return res.status(500).json({
        message:"JWT secret is not configured"
    })
}

    try{
        const decoded = jwt.verify(authHeaders , JWT_SECRET);


        if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
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