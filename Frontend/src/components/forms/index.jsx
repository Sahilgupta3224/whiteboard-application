import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";

const Forms =({uuid,socket,setUser})=>{
    return(
        <div>
            <div>
                <h1>Create Room</h1>
                <CreateRoomForm uuid={uuid} socket = {socket} setUser={setUser}/>
            </div>
            <div>
                <h2>Join Room</h2>
                <JoinRoomForm uuid={uuid} socket = {socket} setUser={setUser}/>
            </div>
        </div>
    )
}

export default Forms;