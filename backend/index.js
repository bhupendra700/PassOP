import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import shareRouter from "./routes/shareRouter.js";
dotenv.config();
import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 8000
connectDB()
const app = express();
app.use(cookieParser())

const allowedOrigin = ["http://localhost:5173", "http://172.31.208.106:5173"]
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => res.send("Hello Worlds"))

app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use('/share', shareRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
})

const users = {};

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        users[userId] = socket.id;
    })

    socket.on("request_send", (data) => {
        const { userId, userDetails } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("request_send_listen", userDetails);
        }
    })

    socket.on("request_cancel", (data) => {
        const { MyUserId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("request_cancel_listen", MyUserId);
        }
    })

    socket.on("accept-pending-request", (data) => {
        const { MyUserId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("sentRequestAccepted", MyUserId);
        }
    })

    socket.on("reject-pending-request", (data) => {
        const { MyUserId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("sentRequestRejected", MyUserId);
        }
    })

    socket.on("deleteuseranddocsfromsent", (data) => {
        const { MyUserId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("deleteuseranddocsfromsent2", MyUserId);
        }
    })

    socket.on("deleteuseranddocsfromrecieved", (data) => {
        const { MyUserId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("deleteuseranddocsfromrecieved2", MyUserId);
        }
    })

    socket.on("deletedocsfromsent", (data) => {
        const { shareId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("deletedocsfromsent1", shareId);
        }
    })

    socket.on("deletedocsfromrecieved", (data) => {
        const { shareId, userId } = data;
        if (users[userId]) {
            io.to(users[userId]).emit("deletedocsfromrecieved1", shareId);
        }
    })

    socket.on("shared", (data) => {
        let { id, obj } = data
        if (users[id]) {
            io.to(users[id]).emit("adddocs", obj);
        }
    })

    socket.on("edit", (data) => {
        let { id, obj } = data
        if (users[id]) {
            io.to(users[id]).emit("editRecievedDocs", obj);
        }
    })

    socket.on("delete", (data) => {
        let { id, passwordId } = data
        if (users[id]) {
            io.to(users[id]).emit("deleteRecievedDocs", passwordId);
        }
    })

    socket.on("deleteUser" , (data)=>{
        const {userId , Ids} = data;
        if(Ids.length > 0){
            Ids.forEach(id => {
                if(users[id]){
                    io.to(users[id]).emit("deleteAll" , userId);
                }
            });
        }
    })

    socket.on("disconnect", () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
    })
})

server.listen(port, () => {
    console.log(`Server is started at port ${port}`);
})