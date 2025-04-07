import { JWT_SECRET } from "@repo/common-backend/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingMessage } from "http";
import { RawData, WebSocketServer, WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port : 8080 });

// to store userID of user who connect the websocket servedr
const clientUser = new Map<WebSocket, string>();
const clientRoom = new Map<WebSocket, number>();

//Messages types
interface JoinMessage {
  type : "join";
  roomId : number;
}

interface ChatMessage {
  type : "chat";
  message : string;
}

// extract the token from header
wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
  const authHeader = request.headers["authorization"] ?? "";
  const token = String(authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : "");
  

  if(!token) {
    ws.close(1008, "No token provided");
  }

  // verify the token and authenticate user
  let userId : string ;
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if(!decoded || !decoded.userId) {
      ws.close(1008, "Invalid Token");
      return;
    }

    userId = decoded.userId;
    clientUser.set(ws, userId);
    

  }catch(e){
    ws.close(1008, "Invalid Token");
    return;
  }

  console.log(`User ${userId} connected`);

  //join room and send message to all users

  ws.on("message", async(data : RawData) => { 
    try {
      const message = JSON.parse(data.toString()) as JoinMessage | ChatMessage;
      if(message.type === "join") {
        const { roomId } = message ; 

        //validate user
        const room = await prismaClient.room.findUnique({where : {id : roomId}});
        const user = await prismaClient.user.findUnique({where : {id : userId}});

        if(!room || !user) {
          ws.send(JSON.stringify({error : "Invalid room or User"}));
          ws.close();
          return;
        }

        clientRoom.set(ws, roomId);
        console.log(`User ${userId} joined room ${roomId}, clinetRoom Size: ${clientRoom.size}`);
        console.log(`Current room for ws : ${clientRoom.get(ws)}`);
        ws.send(JSON.stringify({message : `Joined room ${roomId}`}));
        return;
      }

      // handle chat message
      if(message.type === "chat") {
        const roomId = clientRoom.get(ws);
        console.log(`Chat message from ${userId}, looking for roomId: ${roomId}`);
        if(!roomId) {
          console.log(`User ${userId} not in a room, clientRoom entries:`, Array.from(clientRoom.entries()));
          ws.send(JSON.stringify({ error : "You must have join the room first"}));
          return;
        }
        console.log(`chat message from ${userId} in room ${roomId}: ${message.message}`);

        //store messages in DB
        const savedMessages = await prismaClient.chat.create({
          data : {
            roomId,
            userId,
            message : message.message
          }
        })

        //broadcast message to all users in room
        const broadcastMessage = {
          type : "chat",
          userId,
          message : message.message,
          createdAt : savedMessages.createdAt,
        };

        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
              const clientRoomId = clientRoom.get(client);
              if (clientRoomId === roomId) {
                  client.send(JSON.stringify(broadcastMessage));
              }
          }
      });
      }

    }catch(e){
      console.error(e);
      ws.send(JSON.stringify({ error : "Invalid message" }));
    }

  });

  ws.on("close", () => {
    clientUser.delete(ws);
    console.log(`User ${userId} disconnected`);
  });

});