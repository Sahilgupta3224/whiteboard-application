const express = require('express');
const app = express();
const cors = require("cors")
// Enable CORS
/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
*/
const http = require("http");
const{Server} = require("socket.io")
const server = http.createServer(app);
const io = new Server(server);
const {addUser,getUsers,removeUser,getUsersInRoom} = require("./usersfol/users.js")

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


app.get('/',(req,res)=>{
    res.send("blah blah blah")
})

let roomIdGlobal,imgUrlGlobal;

io.on("connection",(socket)=>{
    //console.log("user connected",socket.id)
    socket.on("userJoined",(data)=>{
        //console.log("user-joined")
        const {name,roomId,userId,host,presenter}=data;
        roomIdGlobal = roomId
        //socket.roomId = roomId;
        //const user = addUser(socket.id, name, roomId, host, presenter);
        socket.join(roomId)
        //socket.join(user.room);
        //const roomUsers = getUsers(user.room);
        const users = addUser({name,roomId,userId,host,presenter,socketId:socket.roomId})
        socket.emit("userIsJoined",{success:true,users});
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name)
        socket.broadcast.to(roomId).emit("allUsers",users);
        socket.broadcast.to(roomId).emit("WhiteboardDataResponse",{
            imgUrl:imgUrlGlobal,
        })
        //io.to(user.room).emit("users", roomUsers);
        //io.to(user.room).emit("canvasImage", imgUrl);
    });

    /*socket.on("drawing", (data) => {
        imageUrl = data;
        socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
      });*/    
    
    socket.on("disconnect", () => {
        const roomUser = getUsers(socket.roomId);
        if(roomUser){
            const users = removeUser(socket.roomId)
        }
        socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted",roomUser)
      });

      socket.on('message',(data)=>{
        const {message} = data
        const user = getUsers(socket.roomId)
        if(user){
            socket.broadcast.to(roomIdGlobal).emit("messageResponse",{message,name:user.name})
        }
       
    })

    socket.on("whiteboardData",(data)=>{
        imgUrlGlobal=data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse",{
            imgUrl:data,
        })
    })
    
    /*socket.on("whiteboardImage",(data)=>{
        imageUrl = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardImageRes",{
            imgUrl:imageUrl,
        })
    })

    socket.on("whiteboardData", (data) => {
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", data);
      });

      socket.on("whiteboardDataResponse", (data) => {
        SetElements(data);
      });*/
})

app.get('/',(req,res)=>{
    res.send("this is the server for my whiteboard app")

})

const Port = process.env.PORT || 3000;
const host="localhost";
server.listen(Port,host,()=>{
    console.log("server running")
})


/*const express=require("express")
const app=express()
const {addUser,getUser,removeUser} = require("./utils/user")

const http = require("http")
const {Server} = require("socket.io")

//creating http server for our app
const server=http.createServer(app)

//creating server instance for socket
const io = new Server(server)

let imgURLGlobal,roomIdGlobal;

io.on("connection",(socket)=>{
    console.log("user connected",socket.id)
    socket.on('user-joined',(userData)=>{
        const {name,id,userId,host,presenter} = userData
        roomIdGlobal = id
        socket.join(id)
        const users = addUser({name,id,userId,host,presenter,socketId:socket.id})
        socket.emit('room-joined',{success : true,users})
        socket.broadcast.to(id).emit("userJoinedMessageBroadcasted",name)
        socket.broadcast.to(id).emit("allUsers",users)
        socket.broadcast.to(id).emit("WhiteboardImageRes",{
            imgURL:imgURLGlobal,
        })
       })

    socket.on("WhiteboardImage",(data)=>{
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("WhiteboardImageRes",{
            imgURL:data,
        })

    })

    socket.on('message',(data)=>{
        const {message} = data
        const user = getUser(socket.id)
        if(user){
            socket.broadcast.to(roomIdGlobal).emit("messageResponse",{message,name:user.name})
        }
       
    })

    socket.on("disconnect",()=>{
        const user = getUser(socket.id);

        if(user){
            const users = removeUser(socket.id)
        }

        socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted",user)
    })
})




//Routes
app.get('/',(req,res)=>{
    res.send("this is the server for my whiteboard app")

})

const port= process.env.port || 3000
const host="localhost"

server.listen(port,host,()=>{
    console.log("server is listening")
})*/

