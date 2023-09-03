import React, { useState, useRef, useEffect } from 'react';
import './Employedashboard.css';
import persontwo from '../Assets/person.png';
import hamburger from '../Assets/hamburger-menu-icon-png-white-18 (1).jpg'
import close from '../Assets/icons8-close-window-50.png'

function Chatbotapistwo() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const messageListRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const[hamburgerdisplay,sethamburgerdisplay]=useState(true) // New state for mobile sidebar

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

 
  const clearChat = () => {
    setMessages([]);
    setQuestions([]);
  };

  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessage = {
      text: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setQuestions([...questions, userInput]);
    setMessages([...messages, newMessage]);
    setUserInput('');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
 function hamburgerclose(){

   sethamburgerdisplay(!hamburgerdisplay); 

 }

 function hamburgerdisappearing(){

  sethamburgerdisplay(!hamburgerdisplay); 
 }
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
    
      sendMessage();
    }
  };
  

  return (
    <>
      <div className={`navbar ${inputFocused ? 'navbar-focused' : ''}`}>
        <div className='chat-parent-div'>
          {/* <div className='chat-name-div'>Chat</div> */}
          <div className='hamburger-button'  onClick={hamburgerclose}>
              {/* <div  style={{cursor:"pointer"}}> */}
                <img src={hamburger} style={{width:"60px",height:"60px"}}  className="hamburger-icon"/>
              {/* </div> */}
          </div>
        </div>

        <div className='clear-chat-parent-div'>
          <div className='new-chat-div' onClick={clearChat}>+ New Chat</div>
          <div className={`toggle-sidebar-button ${mobileSidebarOpen ? 'open' : ''}`} onClick={toggleMobileSidebar}>
            <img src={persontwo} alt="person-icon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          
        </div>
      </div>

      <div className={hamburgerdisplay ? 'sidebaropen' : 'sidebarclose'}>
        <div className='sidebar-content'>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
          <h2 >Questions</h2>
          <h1 onClick={hamburgerdisappearing} className='hamburgerdisappearingicon'>
            <img src={close} style={{width:"40px",height:"40px"}}/>
          </h1>
         
          </div>
          <ul>
  {questions.slice().reverse().map((question, index) => (
    <li key={index} className='question'>
      {question}
    </li>
  ))}
</ul>
        </div>
      </div>

      <div className="chat-app" style={{border:"1px solid yellow"}}>
        <div className="chat" style={{border:"1px solid green"}}>
          <div className="message-list" ref={messageListRef} style={{border:"1px solid red"}} >
            {messages.map((message, index) => (
              <div key={index} className="message"  style={{border:"1px solid white",backgroundColor:"white"}}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className='user-parent-div'>
                    <div className='user-timestamp-parent-div'>
                      <div className='user-name-div'>user</div>
                      <div className='user-time-div'>{message.timestamp}</div>
                    </div>
                    <div className='user-question-div'>{message.text}</div>
                  </div>
                  <div className='user-parent-output-div'>
                    <div className='user-timestamp-parent-div-two'>
                      <div className="chatbot-name-div">Chatbot</div>
                      <div className='chatbot-time-div'>{message.timestamp}</div>
                    </div>
                    <div className='chatbot-output-div'>output</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="user-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              style={{
                width: "100%",
                // Prevent text from wrapping
                 overflow: "hidden",
                 wordWrap:"now-wrap"
              }}
            />
           
            <button onClick={sendMessage}>Send</button>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Chatbotapistwo;