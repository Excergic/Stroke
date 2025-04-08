import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/common-backend/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    try {
        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if(decode){
            req.userId = decode.userId;
            next();
        }
        else{
            res.status(400).json({
                message : "Unauthorized"
            });
        }
    } catch(err) {
        res.status(401).json({
            message : "Unauthorized"
        });
    }
}