import React, { useState, useRef, useEffect } from 'react';
import '../Employeedashboardsection/Employeenew.css';
import persontwo from '../Assets/person.png';
import hamburger from '../Assets/hamburger-menu-icon-png-white-18 (1).jpg';
import close from '../Assets/icons8-close-window-50.png';
import axios from 'axios';

function Emplyedashboard() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chats, setChats] = useState([]);
  const messageListRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hamburgerdisplay, setHamburgerDisplay] = useState(true);
  const [selectedChatTitle, setSelectedChatTitle] = useState('');
  const [messageHistory, setMessageHistory] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionOrder, setQuestionOrder] = useState([]);
  const [apiResponse, setApiResponse] = useState({});
  const [conversationHistory, setConversationHistory] = useState(["hiii"]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setUserInput(e.target.value);
  };

  const clearChat = () => {
    if (messages.length > 0) {
      const chatTitle = `Chat ${chats.length + 1}`;
      const chatData = { title: chatTitle, answers: messages };
      setChats([...chats, chatData]);

      if (currentQuestion) {
        setMessageHistory((prevHistory) => ({
          ...prevHistory,
          [currentQuestion]: messages,
        }));
      }

      setCurrentQuestion('');
      setUserInput('');
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessage = {
      text: userInput,
      timestamp: new Date().toLocaleTimeString(),
      sender: "user",
    };

    setMessages([...messages, newMessage]);

    setConversationHistory((prevHistory) => [...prevHistory, `${newMessage.sender}: ${newMessage.text} <END_OF_TURN>`]);

    if (currentQuestion) {
      setMessageHistory((prevHistory) => ({
        ...prevHistory,
        [currentQuestion]: [...(prevHistory[currentQuestion] || []), newMessage],
      }));
    } else {
      setCurrentQuestion(userInput);
      setQuestionOrder([...questionOrder, userInput]);
      setMessageHistory((prevHistory) => ({
        ...prevHistory,
        [userInput]: [newMessage],
      }));
    }

    setUserInput('');

    const querys = userInput;

    const requestBody = {
      human_say: querys,
      conversation_history: conversationHistory,
    };

    const headerObject = {
      'Content-Type': 'application/json',
      "Accept": "*/*",
    };

    const dashboardsApi = "http://sales-agent.apprikart.com/api/sales_agent/chat";

    axios.post(dashboardsApi, requestBody, { headers: headerObject })
      .then((response) => {
        console.log("API Response:", response);
        // const responseData = JSON.parse(response.data.say);
        const chatbotResponse = response.data.say;
        console.log("chatbotresponse",chatbotResponse)

        setApiResponse((prevResponse) => ({
          ...prevResponse,
          [userInput]: chatbotResponse,
        }));
      })
      .catch((err) => {
        console.error("API Error:", err);
       
        
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  function hamburgerclose() {
    setHamburgerDisplay(!hamburgerdisplay);
  }

  function hamburgerdisappearing() {
    setHamburgerDisplay(!hamburgerdisplay);
  }

  const selectChat = (title) => {
    setSelectedChatTitle(title);

    if (title === 'New Chat') {
      setCurrentQuestion('');
      setMessages([]);
    } else {
      setCurrentQuestion(title);

      if (messageHistory[title]) {
        setMessages(messageHistory[title]);
      } else {
        setMessages([]);
      }
    }
  };

  const displayChat = (title) => {
    setCurrentQuestion(title);
    if (title === 'New Chat') {
      setMessages([]);
    } else {
      setMessages(messageHistory[title] || []);
    }
  };

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
          <div className='hamburger-button' onClick={hamburgerclose}>
            <img
              src={hamburger}
              alt="hamburger-icon"
              style={{ width: '60px', height: '60px' }}
              className='hamburger-icon'
            />
          </div>
        </div>

        <div className='clear-chat-parent-div'>
          <div className='new-chat-div' onClick={clearChat}>
            + New Chat
          </div>
          <div
            className={`toggle-sidebar-button ${
              mobileSidebarOpen ? 'open' : ''
            }`}
            onClick={toggleMobileSidebar}
          >
            <img
              src={persontwo}
              alt='person-icon'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      <div className={hamburgerdisplay ? 'sidebaropen' : 'sidebarclose'}>
        <div className='sidebar-content'>
          <ul className='question-section'>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div>
                <li
                  key='New Chat'
                  className={`chat-title ${
                    selectedChatTitle === 'New Chat' ? 'selected' : ''
                  }`}
                  onClick={() => selectChat('New Chat')}
                >
                  Question history
                </li>
              </div>

              <div onClick={hamburgerdisappearing} className='hamburgerdisappearingicon'>
                <img src={close} alt="close-icon" style={{ width: "40px", height: "40px" }} />
              </div>

            </div>
            {questionOrder.map((question, index) => (
              <li
                key={index}
                style={{ border: "1px solid grey", backgroundColor: "grey", padding: "10px", margin: "5px", cursor: "pointer" }}
                className={`chat-title ${
                  question === selectedChatTitle ? 'selected' : ''
                }`}
                onClick={() => selectChat(question)}
              >
                {question}
              </li>
            ))}
          </ul>

        </div>
      </div>

      <div className='chat-app' >
        <div className='chat' >
          <div
            className='message-list'
            ref={messageListRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className='message'
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className='user-parent-div'>
                    <div className='user-timestamp-parent-div'>
                      <div className='user-name-div'>user</div>
                      <div className='user-time-div'>{message.timestamp}</div>
                    </div>
                    <div className='user-question-div'>{message.text}</div>
                  </div>
                  <div className='user-parent-output-div'>
                    <div className='user-timestamp-parent-div-two'>
                      <div className='chatbot-name-div'>Pannaga</div>
                      <div className='chatbot-time-div'>{message.timestamp}</div>
                    </div>
                    <div className='chatbot-output-div'>
                      {apiResponse[message.text] ? apiResponse[message.text] : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='user-input'>
            <input
              type='text'
              placeholder='Type your message..'
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Emplyedashboard;
