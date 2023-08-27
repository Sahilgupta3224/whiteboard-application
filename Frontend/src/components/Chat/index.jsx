import React, { useEffect } from 'react'
import { useState } from 'react'


const Chat = ({setOpenedChatBar,socket}) => {
    const [chat,setChat] = useState([])
    const [message,setMessage]=useState("")
console.log(chat)
useEffect(()=>{
    socket.on("messageResponse",(data)=>{
        setChat(prevChats=>[...prevChats,{message:data.message,name:data.name}]);
    
        return () => socket.off("messageResponse")
    })

},[chat,socket])

function handleSubmit(e){
    e.preventDefault()
    if(message.trim()!==""){
    socket.emit('message',{message})
    }
    setChat(prevChats=>[...prevChats,{message,name:"You"}])
    setMessage("");

}

  return (
    <div style={{
        height: "100vh",
        width: "400px",
        position: "fixed",
        top: "0",
        left: "0",
        backgroundColor: "white",
        color: "black"
    }}
    className='shadow-lg'>
        <button 
        onClick={()=>setOpenedChatBar(false)}
        >✖</button>
        <div style={{color:"white",height:"90%"}}>
          {
            chat.map((msg,index)=>(
                <p style={{color:"black",margin:"2rem"}} key={index*999}>{msg.name}:{msg.message}</p>

            ))
          }
          </div>
          <form onSubmit={handleSubmit}>
          <input 
          type="text" 
          placeholder='Enter message'
          value={message}
          onChange={(e)=>setMessage(e.target.value)}>
          </input>
          <button className="p-1 mx-1 text-green-500">➤</button>
          </form>
          </div>
  )
}

export default Chat