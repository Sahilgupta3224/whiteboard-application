import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Forms from './components/forms'
import { Route,Routes } from 'react-router-dom'
import Room from './pages/Room'
import io from "socket.io-client"
import {ToastContainer,toast} from "react-toastify"

const server = "http://localhost:3000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"]
}

const socket = io(server, connectionOptions)

const App=()=> {
  const [userNo, setUserNo] = useState(0);
  const [roomJoined, setRoomJoined] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      console.log("thb");
      if(data.success){
        console.log("userJoined");
        setUsers(data.users)
      }
      else{
        console.log("something went wrong");
      }
    });
    console.log("dfsfs");
    socket.on("allUsers",(data)=>{
      console.log("sdfd");
      setUsers(data);
    })

    socket.on("userJoinedMessageBroadcasted",(data)=>{
      console.log(`${data} joined the room`)  
      toast.info(`${data} joined the room`)
    })
  
    socket.on("userLeftMessageBroadcasted",(data)=>{
      console.log(`${data.name} left the room`);
      toast.info(`${data.name} left the room`)
    })
  },[])
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>}/>
        <Route path="/:roomId" element={<Room userNo={userNo} setUserNo={setUserNo} user={user} socket={socket} users={users}/>}/>
      </Routes>
    
    </>
  )
}

export default App;

