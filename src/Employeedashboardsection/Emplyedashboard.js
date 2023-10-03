import React, { useState, useRef, useEffect } from 'react';
import '../Employeedashboardsection/Employeenew.css';
import persontwo from '../Assets/person.png';
import hamburger from '../Assets/hamburger-menu-icon-png-white-18 (1).jpg';
import close from '../Assets/icons8-close-window-50.png';
import sales from '../Assets/Salesagenticon.png';
import axios from 'axios';

function EmployeeDashboard() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chats, setChats] = useState([]);
  const messageListRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hamburgerDisplay, setHamburgerDisplay] = useState(true);
  const [selectedChatTitle, setSelectedChatTitle] = useState('');
  const [messageHistory, setMessageHistory] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionOrder, setQuestionOrder] = useState([]);
  const [apiResponse, setApiResponse] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedChatHistory, setSelectedChatHistory] = useState([]);
  const [userEnteredQuestions, setUserEnteredQuestions] = useState([]);



  const handleInputChange = (e) => {
    e.preventDefault();
    setUserInput(e.target.value);
  };
 
  const clearChat = () => {
    if (messages.length > 0) {
      // Save the current chat in chats history
      const chatTitle = `Chat ${chats.length + 1}`;
      const chatData = { title: chatTitle, answers: messages };
      setChats([...chats, chatData]);
  
      // Clear the current chat state
      setCurrentQuestion('');
      setUserInput('');
      setMessages([]);
      setSelectedChatTitle(''); // Reset selected chat title
      setMessageHistory((prevHistory) => {
        const updatedHistory = { ...prevHistory };
        delete updatedHistory[currentQuestion]; // Remove current chat history
        return updatedHistory;
      });
  
      // Set up the initial message from Pannaga for the new chat
      const initializePannagaMessage = "Hi, this is Pannaga from KIA Motors. How can I assist you?";
      setConversationHistory([`Pannaga: ${initializePannagaMessage}`]);
    }
  };
  
  const sendMessage = () => {
    if (userInput.trim() === '') return;

    const newMessage = {
      text: userInput,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
    };

    setMessages([...messages, newMessage]);

    setConversationHistory((prevHistory) => [
      ...prevHistory,
      `User: ${userInput}`,
    ]);

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
    setUserEnteredQuestions((prevQuestions) => [...prevQuestions, userInput]);
console.log("before api call",conversationHistory)
    const query = userInput;

    const requestBody = {
      human_say: query,
      conversation_history: conversationHistory,
    };

    const headerObject = {
      'Content-Type': 'application/json',
      Accept: '/',
    };

    const dashboardsApi = 'http://sales-agent.apprikart.com/api/sales_agent/chat';

    axios
      .post(dashboardsApi, requestBody, { headers: headerObject })
      .then((response) => {
        console.log('API Response:', response);

        const chatbotResponse = response.data.say;
        const modifiedResponse = chatbotResponse
          .replace(/\bHello!,This is Pannaga from KIA Motors\b/g, '')
          .replace('<END_OF_TURN>', '')
          .trim();
        console.log('chatbotresponse', modifiedResponse);

        setApiResponse((prevResponse) => ({
          ...prevResponse,
          [userInput]: modifiedResponse,
        }));

        setConversationHistory((prevHistory) => [
          ...prevHistory,
          `Pannaga: ${modifiedResponse}`,
        ]);
        console.log("conversaation after api call",conversationHistory)
      })
      .catch((err) => {
        console.error('API Error:', err);
    
        // Define the error message based on the error type
        let errorMessage = 'Internal Server Error';
    
        if (!err.response) {
          errorMessage = 'Internal Server Error: No response from the server';
        }
    
        // Display the error message in the UI
        const errorResponse = `Pannaga: ${errorMessage}`;
        
        setConversationHistory((prevHistory) => [
          ...prevHistory,
          errorResponse,
        ]);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  function hamburgerClose() {
    setHamburgerDisplay(!hamburgerDisplay);
  }

  function hamburgerDisappearing() {
    setHamburgerDisplay(!hamburgerDisplay);
  }

  const selectChat = (title) => {
    if (title === 'New Chat') {
      setCurrentQuestion('');
      setMessages([]);
      setConversationHistory([]);
    } else {
      setSelectedChatTitle(title);
  
      // Retrieve the chat history for the selected title from the chats state
      const selectedChat = chats.find((chat) => chat.title === title);
  
      if (selectedChat) {
        setMessages(selectedChat.answers);
  
        // Construct conversation history based on messages
        const conversation = selectedChat.answers.map((message) => {
          if (message.sender === 'user') {
            return `User: ${message.text}`;
          } else {
            return `Pannaga: ${message.text}`;
          }
        });
  
        setConversationHistory(conversation);
      } else {
        // Handle the case where the selected chat is not found
        console.log(`Chat with title "${title}" not found.`);
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
      // Scroll to the bottom whenever the conversation history changes
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  // ... (rest of your component)

useEffect(()=>{
    // Initial message from Pannaga
    const initializePannagaMessage = "Hi, this is Pannaga from KIA Motors. How can I assist you?";
    setConversationHistory([
      `Pannaga: ${initializePannagaMessage}`,
    ]);
  }, []);
  const initializePannagaMessage = () => {
    const initialMessage = "Hi, this is Pannaga from KIA Motors. How can I assist you?";
    setConversationHistory([`Pannaga: ${initialMessage}`]);
  };
  

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  const startNewChat = () => {
    setSelectedChatTitle('New Chat'); // Reset selected chat title to 'New Chat'
    setCurrentQuestion('');
    setMessages([]);
    setConversationHistory([]); // Clear the conversation history
    setSelectedChatHistory([]);
    setQuestionOrder([]); // Clear the question order
    initializePannagaMessage(); 
    setUserEnteredQuestions([])// Initialize the Pannaga message
  };
  
  return (
    <>
      <div className={`navbar ${inputFocused ? 'navbar-focused' : ''}`}>
        <div className='chat-parent-div'>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} className='inner-chat-paarent-div'>
            <div>
              <img src={sales} alt="funding-icon" style={{ width: '40px', height: '40px' }} />
            </div>
            <div style={{ color: '#21261B', fontWeight: '600', letterSpacing: '0.5px' }}>
              SALESAGENT.AI
            </div>
          </div>
          <div className='hamburger-button' onClick={hamburgerClose}>
            <img
              src={hamburger}
              alt="hamburger-icon"
              style={{ width: '60px', height: '60px' }}
              className='hamburger-icon'
            />
          </div>
        </div>

        <div className='clear-chat-parent-div'>
          <div className='new-chat-div' onClick={startNewChat}>
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

      <div className={hamburgerDisplay ? 'sidebaropen' : 'sidebarclose'}>
        <div className='sidebar-content'>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }} className='nav-topsec'>
            <div
              key='New Chat'
              className={`chat-title ${
                selectedChatTitle === 'New Chat' ? 'selected' : ''
              }`}
              onClick={() => selectChat('New Chat')}
              style={{ textAlign: "center" }}
            >
              Question history
            </div>

            <div onClick={hamburgerDisappearing} className='hamburgerdisappearingicon' >
              <img src={close} alt="close-icon" style={{ width: "40px", height: "40px" }} />
            </div>

          </div>
          <div style={{ display: "flex", flexDirection: "row", }}>
            <div className='question-section' style={{ flexBasis: "100%" }}  >
            {userEnteredQuestions.map((question, index) => (
                <li
                  key={index}
                  className={`chat-title ${
                    question === selectedChatTitle ? 'selected' : ''
                  }`}
                  onClick={() => {
                    selectChat(question);
                    hamburgerDisappearing();
                  }}
                  style={{ padding: "5px", borderRadius: "5px", backgroundColor: "#191C14", marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}
                >
                  {question}
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='chat-app' >
        <div className='chat' >

          <div
            className='message-list'
            ref={messageListRef}
          >
            {conversationHistory.map((message, index) => (
              <div
                key={index}
                className='message'
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0px',
                    backgroundColor: message.startsWith('User') ? '#FAFAFA' : '#EBEBEB ', // Set background color based on sender
                  }}
                >
                  <div className='user-parent-div'>
                    <div className='user-timestamp-parent-div'>
                    <div
          className={`user-name-div ${
            message.startsWith('User') ? 'user-name' : 'pannaga-name'
          }`}
        >
                        {message.startsWith('User') ? 'USER' : 'PANNAGA'}
                      </div>
                      <div className='user-time-div'>
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                    <div
        className={`user-question-div ${
          message.startsWith('User') ? 'use-question' : 'pannaga-question'
        }`}
      >{message.split(': ')[1]}</div>

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
              style={{ fontFamily: "Sora, sans-serif" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;