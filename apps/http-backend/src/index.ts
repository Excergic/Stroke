import { JWT_SECRET } from "@repo/common-backend/config";
import express, {Request, Response } from "express";
import bcrypt from 'bcrypt';
import  jwt, { decode }  from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin : "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT", "OPRIONS"],
        allowedHeaders: ["Content-type", "Authorization"],
    })
);

// use to parse json data in request method
app.use(express.json());

app.post('/signup', async (req : Request, res: Response) : Promise<any> => {
    const parseData = CreateUserSchema.safeParse(req.body);
    if(!parseData.success){
         res.status(400).json({messsage : "Incorrect Inputs!"})
         return;
    }

    const { username, email, password } = parseData.data;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        // user with prisma
        const user = await prismaClient.user.create({
            data : {
                email,
                username,
                password : hashedPassword
            },
        });

        res.status(201).json({
            userId: user.id
        });
        
    }catch(error : any){
        if(error.code === 'P2002'){
            const field = error.meta?.target?.includes('email')? 'email' : 'username';
            return res.status(409).json({
                message : `${field} already exists`
            });
        }
        console.error(error);
        res.status(500).json({
            message : 'Failed to create users!'
        })
    }
    
});

app.post("/login", async (req, res) : Promise<any> => {
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(401).json({
            message : "Incorret inputs"
        });
        return;
    }

    const { email, password } = parsedData.data;

    try {
        const user = await prismaClient.user.findUnique({
            where: { email } 
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials or User not found" });
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Check your credentials Bro!" });
        }
    
        // Password matches, proceed to JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to login" });
    }
})


app.post("/create-room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(401).json({
            message : "Invalid Credentials"
        });
        return;
    }

    const { slug } = parsedData.data;

    try{
        const adminId = req.userId;
        const room = await prismaClient.room.create({
            data : {
                slug : slug,
                adminId : adminId  
            }
        });
        res.json({
            roomId : room.id
        })

    }catch(err){
        console.error(err);
        res.status(410).json({
            message : "Room already exists"
        })
    }
})

app.get("/chats/:roomId",async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
    
        orderBy: {
            id : "desc"
        },

        take : 50
    });

    res.json({
        messages
    });
});

app.listen(3001);