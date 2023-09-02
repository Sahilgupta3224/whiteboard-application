import React from "react";
import {useNavigate} from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
function JoinRoomForm({uuid,socket,setUser}) {
    const [roomId,setRoomId] = React.useState("")
    const [name,setName] = React.useState("")
    // const [joinName, setJoinName] = useState("");
    //const [joinRoomId, setJoinRoomId] = React.useState("");
    const navigate = useNavigate();

    const handleRoomJoin=(e)=>{
        e.preventDefault();
        if (!name) return toast.dark("Please enter your name!");

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
    //     <form>
    //     <div>
    //         <input
    //         type="text"
    //         placeholder="Enter Your Name"
    //         value={name}
    //         onChange={(e)=>setName(e.target.value)}
    //         />
    //     </div>
    //     <div>
    //         <div>
    //             <input
    //             type="text"
    //             placeholder="Enter Room Code"
    //             value={roomId}
    //             onChange={(e)=>setRoomId(e.target.value)}
    //             />
    //         </div>
    //     </div>
    //     <button type="submit" onClick={handleRoomJoin}>Join Room</button>
    // </form>
    
    <div className="col-md-5 p-5 border mx-auto">
          <h1 className="text-center text-primary mb-5">Join Room</h1>
          <form onSubmit={handleRoomJoin}>
            <div className="form-group my-2">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group my-2">
              <input
                type="text"
                className="form-control outline-0"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room Id"
                style={{
                  boxShadow: "none",
                }}
              />
            </div>
            <div className="form-group mt-5">
              <button type="submit" className="form-control btn btn-dark">
                Join Room
              </button>
            </div>
          </form>
        </div>
     );
}

export default JoinRoomForm;