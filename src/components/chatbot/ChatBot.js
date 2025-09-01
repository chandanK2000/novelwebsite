import React, { useState, useRef, useEffect } from 'react';
import { MessageList, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      position: 'left',
      type: 'text',
      text: 'Hi! I am your assistant. What is your name?',
      date: new Date(),
      title: 'Bot',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    number: '',
  });
  const [step, setStep] = useState('name'); // 'name' | 'email' | 'number' | 'done'

  const messagesContainerRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleNextStep = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    let valid = true;
    let errorMsg = '';
    const newMessage = {
      position: 'right',
      type: 'text',
      text: trimmedInput,
      date: new Date(),
      title: 'You',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png',
    };

    setMessages(prev => [...prev, newMessage]);

    if (step === 'name') {
      setUserInfo(prev => ({ ...prev, name: trimmedInput }));
      setStep('email');
      setMessages(prev => [
        ...prev,
        {
          position: 'left',
          type: 'text',
          text: 'Great! Now, please enter your email.',
          date: new Date(),
          title: 'Bot',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
      ]);
    } else if (step === 'email') {
      if (!/^\S+@\S+\.\S+$/.test(trimmedInput)) {
        valid = false;
        errorMsg = 'Enter a valid email!';
      } else {
        setUserInfo(prev => ({ ...prev, email: trimmedInput }));
        setStep('number');
        setMessages(prev => [
          ...prev,
          {
            position: 'left',
            type: 'text',
            text: 'Thanks! Finally, enter your 10-digit phone number.',
            date: new Date(),
            title: 'Bot',
            avatar: 'https://i.pravatar.cc/150?img=3',
          },
        ]);
      }
    } else if (step === 'number') {
      if (!/^\d{10}$/.test(trimmedInput)) {
        valid = false;
        errorMsg = 'Enter a valid 10-digit number!';
      } else {
        setUserInfo(prev => ({ ...prev, number: trimmedInput }));
        setStep('done');
        localStorage.setItem('chatUser', JSON.stringify({ ...userInfo, number: trimmedInput }));
        setMessages(prev => [
          ...prev,
          {
            position: 'left',
            type: 'text',
            text: `Thanks ${userInfo.name}! You can now start chatting.`,
            date: new Date(),
            title: 'Bot',
            avatar: 'https://i.pravatar.cc/150?img=3',
          },
        ]);
      }
    }

    if (!valid) {
      setMessages(prev => [
        ...prev,
        {
          position: 'left',
          type: 'text',
          text: errorMsg,
          date: new Date(),
          title: 'Bot',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
      ]);
    } else {
      setInput('');
    }
  };

  // const handleSendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMessage = {
  //     position: 'right',
  //     type: 'text',
  //     text: input,
  //     date: new Date(),
  //     title: 'You',
  //     avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  //   };
  //   setMessages(prev => [...prev, userMessage]);
  //   setInput('');

  //   try {
  //     const res = await fetch('http://127.0.0.1:8080/ask', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ question: input }),
  //     });
  //     const data = await res.json();

  //     const botMessage = {
  //       position: 'left',
  //       type: 'text',
  //       text: data.answer || 'No response',
  //       date: new Date(),
  //       title: 'Bot',
  //       avatar: 'https://i.pravatar.cc/150?img=3',
  //     };
  //     setMessages(prev => [...prev, botMessage]);
  //   } catch (error) {
  //     setMessages(prev => [
  //       ...prev,
  //       {
  //         position: 'left',
  //         type: 'text',
  //         text: 'Error getting response.',
  //         date: new Date(),
  //         title: 'Bot',
  //         avatar: 'https://i.pravatar.cc/150?img=3',
  //       },
  //     ]);
  //   }
  // };



  const handleSendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = {
    position: 'right',
    type: 'text',
    text: input,
    date: new Date(),
    title: 'You',
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  };
  setMessages(prev => [...prev, userMessage]);
  setInput('');

  try {
    const res = await fetch('http://127.0.0.1:8080/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: input,
        userInfo: userInfo, // ✅ send user info along with the question
      }),
    });
    const data = await res.json();

    const botMessage = {
      position: 'left',
      type: 'text',
      text: data.answer || 'No response',
      date: new Date(),
      title: 'Bot',
      avatar: 'https://i.pravatar.cc/150?img=3',
    };
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    setMessages(prev => [
      ...prev,
      {
        position: 'left',
        type: 'text',
        text: 'Error getting response.',
        date: new Date(),
        title: 'Bot',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
    ]);
  }
};

  return (
    <div className="chatbot-wrapper">
      <button className="chat-toggle-button" onClick={toggleChat}>
        {isOpen ? '×' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <MessageList
            className="message-list"
            lockable={true}
            referance={messagesContainerRef}
            dataSource={messages}
          />

          <div className="chatbot-input-area">
            <Input
              placeholder={
                step === 'name'
                  ? 'Enter your name...'
                  : step === 'email'
                  ? 'Enter your email...'
                  : step === 'number'
                  ? 'Enter your number...'
                  : 'Type a message...'
              }
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  step === 'done' ? handleSendMessage() : handleNextStep();
                }
              }}
              rightButtons={
                <Button
                  text={step === 'done' ? 'Send' : 'Next'}
                  onClick={step === 'done' ? handleSendMessage : handleNextStep}
                />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
