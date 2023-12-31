import rough from 'roughjs';
import React from 'react';
import {useEffect} from 'react';
import { useState } from 'react';

const roughGenerator = rough.generator();

const WhiteBoard =({canvasRef,ctxRef,elements,SetElements,tool,color,user,socket,strokeWidth,fillcolor})=>{
    const[image,setImage] = useState(null);

    useEffect(()=>{
        socket.on("whiteboardDataResponse",(data)=>{
            setImage(data.imgUrl);
            console.log(data.imgUrl);
        });
    },[])

    if(!user?.presenter){
         return(
    //    <div
    // className="border border-dark border-3 h-100 w-100 overflow-hidden"
    // >
    //     <img src={image} alt="Real time whiteBoard image shared by presenter" 
    //     style={{
    //         height:window.innerHeight*2,
    //         width:window.innerHeight*2,
    //         maxWidth:"none",
    //         border:"2px solid red",
    //     }}
    //     />
    // </div>
    <div
        style={{border:"2px solid black",
        height:"100vh",width:"100vw",
        overflow:"hidden",
        backgroundColor:"white",
        }}  >
            <img src={image} 
            alt="real time white board image shared by presenter"
            style={{
              height:window.innerHeight*2,
              width:window.innerWidth*2,
              maxWidth:"none",
              border:"2px solid red",
            }}/>
        </div>
    )
    }
    
    useEffect(()=>{
        const canvas = canvasRef.current;
        if(canvas){
        canvas.height = 2*window.innerHeight;
        canvas.height = 2*window.innerHeight;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle =color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctxRef.current = ctx;
        }
    },[]); 

    useEffect(()=>{
        if(canvasRef.current){
            ctxRef.current.strokeStyle = color;
            // ctxRef.current.lineWidth = strokeWidth;
        }
    },[color]);

    const [isDrawing,setIsDrawing] = React.useState(false);
    React.useLayoutEffect(()=>{
        if(canvasRef.current){
            const roughCanvas = rough.canvas(canvasRef.current);
        if(elements.length>0){
            ctxRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            )
        }
        elements.forEach((element)=>{
            if(element.type ==="pencil"){
                roughCanvas.linearPath(element.path,
                    {
                        stroke:element.color,
                        strokeWidth:element.strokeWidth,
                        roughness:0
                    }
                    );    
            }
            if(element.type==="line"){
                roughCanvas.draw(
                    roughGenerator.line(element.offsetX,element.offsetY,element.width,element.height,
                        {
                            stroke:element.color,
                            strokeWidth:5,
                            roughness:0
                        })
                )
                
                
            }
            if(element.type==="rect"){
                roughCanvas.draw(
                    roughGenerator.rectangle(element.offsetX,element.offsetY,element.width,element.height,
                        {
                            stroke:element.color,
                            strokeWidth:5,
                            roughness:0
                        }
                        )
                )
            }
            if (element.type === "circle") {
                roughCanvas.draw(
                  roughGenerator.circle(element.offsetX, element.offsetY, element.radius, {
                    stroke: element.color,
                    strokeWidth: 5,
                    roughness: 0,
                  })
                );
              }
              if (element.type === "oval") {
                roughCanvas.draw(
                  roughGenerator.ellipse(
                    element.offsetX,
                    element.offsetY,
                    element.width,
                    element.height,
                    {
                      stroke: element.color,
                      strokeWidth: 5,
                      roughness: 0,
                    }
                  )
                );
              }
        })
        const canvasImage = canvasRef.current.toDataURL();
        socket.emit("whiteboardData",canvasImage);
        }
    },[elements])

    const handleMouseDown = (e)=>{
        const {offsetX , offsetY} = e.nativeEvent;
        if(tool==="pencil"){
            SetElements((prev)=>[
                ...prev,
                {
                  type:"pencil",
                  offsetY,
                  offsetX,
                  path: [[offsetX,offsetY]],
                  // stroke: color
                  color,
                  strokeWidth,
                },
            ]);
        }

        else if(tool==="line"){
            SetElements((prev)=>[
                ...prev,
                {
                    type:"line",
                    offsetY,
                    offsetX,
                    width:offsetX,
                    height:offsetY,
                    stroke: color
                }
            ])
        }
       
        else if(tool==="rect"){
            SetElements((prev)=>[
                ...prev,
                {
                    type:"rect",
                    offsetY,
                    offsetX,
                    width:0,
                    height:0,
                    stroke: color,
                    fill: fillcolor,
                }
            ])
        }
        else if (tool === "circle") {
            SetElements((prev) => [
              ...prev,
              {
                type: "circle",
                offsetY,
                offsetX,
                radius: 0,
                stroke: color,
              },
            ]);
          } else if (tool === "oval") {
            SetElements((prev) => [
              ...prev,
              {
                type: "oval",
                offsetY,
                offsetX,
                width: 0,
                height: 0,
                stroke: color,
              },
            ]);
          }        
        setIsDrawing(true);
    };
    const handleMouseMove = (e)=>{
        const {offsetX , offsetY} = e.nativeEvent;
        if(isDrawing){
            if(tool==="pencil"){
                const {path} = elements[elements.length -1];
                const newPath = [...path,[offsetX,offsetY]];
                SetElements((prev)=>
                prev.map((ele,index)=>{
                    if(index===elements.length-1){
                        return{
                            ...ele,
                            path:newPath,
                        };
                    }
                    else{
                        return ele;
                    };
                })
            );
            }
            else if(tool==="line"){
                SetElements((prev)=>
                    prev.map((ele,index)=>{
                        if(index===elements.length-1){
                            return{
                                ...ele,
                                width:offsetX,
                                height:offsetY,
                                fill:fillcolor
                            };
                        }
                        else{
                            return ele;
                        };
                    })
                
                )
            }

            else if(tool==="rect"){
                SetElements((prev)=>
                    prev.map((ele,index)=>{
                        if(index===elements.length-1){
                            return{
                                ...ele,
                                width:offsetX -ele.offsetX,
                                height:offsetY -ele.offsetY
                            };
                        }
                        else{
                            return ele;
                        };
                    })
                )
            }
            else if (tool === "circle") {
                const { offsetX: startX, offsetY: startY } = elements[elements.length - 1];
                const radius = Math.sqrt(Math.pow(startX - offsetX, 2) + Math.pow(startY - offsetY, 2));
                SetElements((prev) =>
                  prev.map((ele, index) => {
                    if (index === elements.length - 1) {
                      return {
                        ...ele,
                        radius,
                      };
                    } else {
                      return ele;
                    }
                  })
                );
              } else if (tool === "oval") {
                SetElements((prev) =>
                  prev.map((ele, index) => {
                    if (index === elements.length - 1) {
                      return {
                        ...ele,
                        width: offsetX - ele.offsetX,
                        height: offsetY - ele.offsetY,
                      };
                    } else {
                      return ele;
                    }
                  })
                );
            }
        }
    };
    const handleMouseUp = (e)=>{
        setIsDrawing(false);
    };

    return (
    <>
    <div
    // style={{height:"100vh",width:"100vw",overflow:"hidden"}} 
    className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    >
    <canvas  
        className='bg-white'
        ref={canvasRef}
        width={2 * window.innerWidth}></canvas>
    </div>
    </>
    )
}

export default WhiteBoard;


