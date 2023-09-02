import React, { useEffect } from 'react';
import WhiteBoard from '../../components/canvas';
import './index.css';
import Chat from '../../components/Chat';
const Room=({user,socket,users})=>{
    const canvasRef=React.useRef(null);
    const ctxRef=React.useRef(null);
    const [tool,SetTool] = React.useState("pencil");
    const [color,SetColor] = React.useState("red");
    const [elements,SetElements] = React.useState([]);
    const [history,setHistory] = React.useState([]);
    const [openedUserBar,setOpenedUserBar] = React.useState(false)
    const [openedChatBar,setOpenedChatBar] = React.useState(false)

    React.useEffect(() => {
        socket.on("message", (data) => {
          toast.info(data.message);
        });
      }, []);
      React.useEffect(() => {
        socket.on("users", (data) => {
          setUsers(data);
          setUserNo(data.length);
        });
      }, []);

    const  handleCanvasClear=()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
        SetElements([]);
    }
    const Undo =()=>{
        setHistory((prev)=>[...prev,elements[elements.length -1]]);
        SetElements((prev)=>prev.slice(0,prev.length -1));
        if(elements.length===1){
            handleClear()
        }
    }
    const Redo =()=>{
        SetElements((prev)=>[...prev,history[history.length -1]]);
        setHistory((prev)=>prev.slice(0,prev.length -1));
    }

    return(
        <>
        <div>
        <button onClick={()=>setOpenedUserBar(true)} >Users</button>
        <button onClick={()=>setOpenedChatBar(true)} >Chat</button>
        <div className="display-5 pt-4 pb-3 text-center">Welcome to whiteboard sharing app<span>[users online:{users.length}]</span></div>
       {console.log(users.length)}
        </div>
        <div>
            {
                openedUserBar &&

                (
                    <div style={{
                        height: "100vh",
                        width: "250px",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        backgroundColor: "white",
                        color: "black",
                    }}
                    className='shadow-lg'>
                        <button onClick={()=>setOpenedUserBar(false)} >✖</button>
                        <div style={{color:"black"}}>
                          {/* {users.map((usr,index)=>(
                              <p key={usr.index*999}>{usr.name}{user && user.userId===usr.userId && "(You)"}</p>
                          ))} */}
                          {users.map((usr, index) => (
  <div key={index}>
    <p>{usr.name}</p>
    {user && user.userId === usr.userId && <p>(You)</p>}
  </div>
))}
                          </div></div>
              )}
              {
                  openedChatBar && (
                      <Chat setOpenedChatBar={setOpenedChatBar} socket={socket}/>
      
                  )
              }

                <div>
                <div className="col-md-3">
                    <div className="form-check form-check-inline">
                        <label htmlFor='Pencil'>Pencil</label>
                        <input 
                    type ="radio"
                    id="pencil"
                    name="tool"
                    value="pencil"
                    checked={tool==="pencil"}
                    onChange={(e)=>SetTool(e.target.value)}
                    />
                    </div>
                    <div className="form-check form-check-inline">
                        <label htmlFor='line'>line</label>
                    <input
                    type="radio"
                    id="line"
                    name="tool"
                    value="line"
                    checked={tool==="line"}
                    onChange={(e)=>SetTool(e.target.value)}
                    />
                    </div>
                    <div className="form-check form-check-inline">
                        <label htmlFor='rect'>Rectangle</label>
                    <input
                    type="radio"
                    id="rect"
                    name="tool"
                    value="rect"
                    checked={tool==="rect"}
                    onChange={(e)=>SetTool(e.target.value)}
                    />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="color-picker d-flex align-items-center justify-content-center">
                        <label htmlFor="color">Select Color</label>
                        <input
                        type="color"
                        id="color"
                        value={color}
                        className='mt-1 ms-3'
                        onChange={(e)=>SetColor(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <button 
                    disabled={elements.length===0}
                    onClick={()=>Undo()}
                    className="btn btn-outline-primary"
                    type = "button"
                    >Undo</button>
                    <button
                    disabled={history.length===0}
                    onClick={()=>Redo()}
                    className="btn btn-outline-primary ml-2"
                    type = "button"
                    >Redo</button>
                </div>
                <div className="col-md-1">
                <div className="color-picker d-flex align-items-center justify-content-center">
                    <button 
                    className="btn btn-danger"
                    onClick={handleCanvasClear}>Clear Canvas</button>
                </div>
                </div>
                </div>

                <WhiteBoard 
                    canvasRef={canvasRef} 
                    ctxRef={ctxRef}
                    elements={elements}
                    SetElements={SetElements}
                    tool={tool}
                    color={color}
                    user={user}
                    socket={socket}
                    />
                
            </div>
        </>
        
            
            )}
            
    


export default Room;