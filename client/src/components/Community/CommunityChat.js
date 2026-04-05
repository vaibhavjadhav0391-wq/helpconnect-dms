import { useRef, useState } from 'react';
import '../../assets/CSS/CommunityChat.css'
import Arrow from '../../assets/images/arrows.png';
export const CommunityChat = () => {
    const Username= 'Arafat';
    const messRef= useRef(null);
    const chats=[
        {
            MessageID:1,
            SenderID : 1,
            SenderName : "Arafat",
            Message : "It's very heartbreaking to watch!",
            Date : "2024-07-18  8:24:49 PM"
        },
        {
            MessageID:2,
            SenderID : 1,
            SenderName : "Arafat",
            Message : "Internet connection is being cut off for 5 days",
            Date : "2024-07-18  8:27:49 PM"
        },
        {
            MessageID:3,
            SenderID : 1,
            SenderName : "Arafat",
            Message : "66 students are killed in first 3 days of protest",
            Date : "2024-07-18  8:28:49 PM"
        },
        {
            MessageID:4,
            SenderID : 2,
            SenderName : "Omi",
            Message : "I don't know how many were killed in the last 2 days !",
            Date : "2024-07-18  8:30:49 PM"
        },
        {
            MessageID:5,
            SenderID : 3,
            SenderName : "Saon",
            Message : "I heard about 100-200 people died on Friday !",
            Date : "2024-07-18  8:31:49 PM"
        }
    ];
    const [chatbox, setChatbox]= useState(chats);
    
    return (
        <div className="chat-page">
            <div className="chatbox-container">
                <div className="chat-header">
                    <h2>Community Chat</h2>
                    <p>Share updates in real time with your neighbors.</p>
                </div>
        
                <div className="chatbox">
                    {chatbox.map((message)=>(
                        <div key={message.MessageID} className='message-container'>
                            <img src={Arrow} className="chat-person" alt="arrow" />
                            <div className="message">
                                <p className="message-author">{message.SenderName===Username?'Me' : message.SenderName}</p>
                                {message.Message}
                                <span className='time'>{message.Date}</span>
                            </div>
                        </div>
                    ))}
            
                    <form name='messForm' className='input-area' onSubmit={(e)=>{
                        e.preventDefault();
                    }}>
                        <input type="text" className="input-text" placeholder="Type your message" ref={messRef} />
                        <button className="sendMessage" onClick={()=>{
                            if (messRef.current.value){
                                var datetime = new Date().toISOString()+" " + (new Date().toLocaleTimeString());
                                var date =   datetime.split('T')[0];
                                var time = datetime.split('Z')[1]
                                const mess=
                                {
                                    MessageID:chatbox.length+1,
                                    SenderID : 1,
                                    SenderName : "Arafat",
                                    Message : messRef.current.value,
                                    Date : date+" "+time
                                }
                                setChatbox([...chatbox,mess])
                                messRef.current.value="";
                                messRef.current.focus();
                            }
                        }}
                        >Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
