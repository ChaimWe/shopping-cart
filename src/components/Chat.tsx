import { useState, useEffect } from "react"; 
import { AskAi } from "../utils/AI"; 
import { Card, Button, Input, List } from "antd"; 
import { RobotFilled } from "@ant-design/icons"; 

export default function Chat() {
  const [visible, setvisible] = useState<boolean>(false); 
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]); 
  const [input, setInput] = useState<string>(""); 

  
  const [position, setPosition] = useState({
    x: window.innerWidth - 100, 
    y: window.innerHeight - 120, 
  });

  
  const [dragging, setDragging] = useState(false); 
  const [offset, setOffset] = useState({ x: 0, y: 0 }); 

  const aiChat = async () => {
    if (!input) return; 
    setMessages((prev) => [...prev, { role: "user", text: input }]); 
    setInput(""); 
    const reply = await AskAi(input); 
    setMessages((prev) => [...prev, { role: "assistant", text: reply }]); 
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => { 
    setDragging(true); 
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y }); 
  };

  const handleMouseMove = (e: MouseEvent) => { 
    if (!dragging) return; 
    setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y }); 
  };

  const handleMouseUp = () => setDragging(false); 

  useEffect(() => { 
    window.addEventListener("mousemove", handleMouseMove); 
    window.addEventListener("mouseup", handleMouseUp); 
    return () => {
      window.removeEventListener("mousemove", handleMouseMove); 
      window.removeEventListener("mouseup", handleMouseUp); 
    };
  }, [dragging, offset]); 

  return (
    <div
   
    >

       {visible && (
        <div    style={{
        position: "fixed", 
        top: position.y -280, 
        left: position.x -280, 
        maxHeight: "500px", 
      marginBottom: '10px'
      }}> 
          <Card
            extra={<Button onClick={() => setvisible(false)}>X</Button>} 
            title="AI Assistant" 
            style={{
              maxWidth: "400px", 
              height: 350, 
              overflowY: "auto", 
              boxShadow: "0 5px 15px rgba(0,0,0,0.25)", 
            }}
          >
            <List>
              {messages.map((msg, i) => (
                <List.Item
                  key={i} 
                  style={{
                    display: "flex", 
                    whiteSpace: "pre-line", 
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start", 
                  }}
                >
                  <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
                  {msg.text} 
                </List.Item>
              ))}
            </List>

            <Input.Search
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onSearch={aiChat} 
              enterButton="send" 
            />
          </Card>
        </div>
      )}

       <div
        style={{
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "#dafade", 
          height: "65px", 
          width: "65px", 
          border: "solid grey 1px", 
          borderRadius: "50%", 
          cursor: "grab", 
          boxShadow: "0 3px 8px rgba(0,0,0,0.25)", 
        position: "fixed", 
        top: position.y, 
        left: position.x, 
        maxHeight: "500px", 
        }}
        onMouseDown={handleMouseDown} 
        onClick={() => (!dragging ? setvisible(!visible) : null)} 
      >
        <RobotFilled style={{ cursor: "pointer", fontSize: 28 }} /> 
      </div>
     
    </div>
  );
}
