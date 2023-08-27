import React from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ToastContainer,toast} from "react-toastify"

function CreateRoomForm({uuid,socket,setUser}) {

    const [roomId,setRoomId] = React.useState(uuid());
    const [name,setName] = React.useState("");


    function  Code(){
        let code = uuid()
        setRoomId(code);
    }

    const [inputValue, setInputValue] = React.useState('');
  
  
    const handleCopyClick = async () => {
        // try {
        //   await navigator.clipboard.writeText(inputValue);
        //   alert('Value copied to clipboard');
        // } catch (error) {
        //   console.error('Unable to copy value:', error);
        // }

        e.preventDefault()
        toast.success("Room Code copied");
      };
      
      function handleCopyText(e){
        e.preventDefault()
        toast.success("Room Code copied");
    }

    const navigate = useNavigate();

    const handleCreateRoom =(e)=>{
        e.preventDefault();

        const roomData ={
            name,
            roomId,
            userId:uuid(),
            host:true,
            presenter:true
        }
        setUser(roomData);
        navigate(`/${roomId}`)
        console.log(roomData)
        socket.emit("userjoined",roomData);

    }
    return ( <form>
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
                placeholder="Generate Room Code"
                value={roomId}
                disabled
                />
                <div>
                    <button onClick={()=>setRoomId(uuid())}>Generate</button>
                    <CopyToClipboard text={roomId}><button onClick={handleCopyText} >Copy</button></CopyToClipboard>

                </div>
            </div>
        </div>
        <button type="submit" onClick={handleCreateRoom}>Generate Form</button>
    </form> );
}

export default CreateRoomForm;