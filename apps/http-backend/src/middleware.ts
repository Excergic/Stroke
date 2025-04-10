import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/common-backend/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const auteHeader = req.headers["authorization"] ?? "";
    const token = String(auteHeader.startsWith("Bearer ") ? auteHeader.split(" ")[1] : "");

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