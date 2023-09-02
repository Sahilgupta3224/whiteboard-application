import React from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ToastContainer,toast} from "react-toastify"
import './index.css'

function CreateRoomForm({uuid,socket,setUser}) {

    const [roomId,setRoomId] = React.useState(uuid());
    const [name,setName] = React.useState("");
    const [joinName, setJoinName] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");


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
        if (!name) return toast.dark("Please enter your name!");

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
    return ( 
    // <form>
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
    //             placeholder="Generate Room Code"
    //             value={roomId}
    //             disabled
    //             />
    //             <div>
    //                 <button onClick={()=>setRoomId(uuid())}>Generate</button>
    //                 <CopyToClipboard text={roomId}><button onClick={handleCopyText} >Copy</button></CopyToClipboard>

    //             </div>
    //         </div>
    //     </div>
    //     <button type="submit" onClick={handleCreateRoom}>Generate Form</button>
    // </form> 
    <div className="col-md-5 p-5 border mx-auto">
    <h1 className="text-center text-primary mb-5">Create Room</h1>
    <form onSubmit={handleCreateRoom}>
      <div className="form-group my-2">
        <input
          type="text"
          placeholder="Name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group my-2 border align-items-center">
        <input
          type="text"
          className="form-control border-0 outline-0"
          value={roomId}
          readOnly={true}
          style={{
            boxShadow: "none",
            zIndex: "0 !important",
            fontsize: "0.89rem !important",
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-primary  border-0 btn-sm"
            type="button"
            onClick={() => setRoomId(uuid())}
          >
            Generate
          </button>
          &nbsp;&nbsp;
          <CopyToClipboard
            text={roomId}
            onCopy={() => toast.success("Room Id Copied To Clipboard!")}
          >
            <button
              className="btn btn-outline-dark border-0 btn-sm"
              type="button"
            >
              Copy
            </button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="form-group mt-5">
        <button type="submit" className="form-control btn btn-dark">
          Create Room
        </button>
      </div>
    </form>
  </div>
    );
}

export default CreateRoomForm;