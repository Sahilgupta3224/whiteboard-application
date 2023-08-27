import React from "react";
import {useNavigate} from "react-router-dom"

function JoinRoomForm({uuid,socket,setUser}) {
    const [roomId,setRoomId] = React.useState("")
    const [name,setName] = React.useState("")
    const navigate = useNavigate();

    const handleRoomJoin=(e)=>{
        e.preventDefault();

        const userData ={
            name,
            roomId,
            userId:uuid(),
            host:false,
            presenter:false,
        }
        setUser(userData);
        navigate(`/${roomId}`)
        console.log(userData)
        socket.emit("userJoined",userData); 
    }
    return (
        <form>
        <div>
            <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
        </div>
        <div>
            <div>
                <input
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e)=>setRoomId(e.target.value)}
                />
            </div>
        </div>
        <button type="submit" onClick={handleRoomJoin}>Join Room</button>
    </form> 
     );
}

export default JoinRoomForm;