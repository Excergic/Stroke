import { JWT_SECRET } from "@repo/common-backend/config";
import  express  from "express";
import  jwt  from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"

const app = express();

app.use(express.json());

app.post('/signup', (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({messsage : "Incorrect Inputs!"})
    }
    return;
})

app.post("/login", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        res.status(401).json({
            message : "Invalid Credentials"
        });
        return;
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    
    res.json({ token });
})


app.post("/create-room", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.status(401).json({
            message : "Invalid Credentials"
        });
        return;
    }

    res.json({
        roomId : 123
    });

})

app.listen(3001);