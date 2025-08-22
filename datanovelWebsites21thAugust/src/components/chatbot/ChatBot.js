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
      text: 'Hi! How can I help you today?',
      date: new Date(),
      title: 'Bot',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ]);
  const [input, setInput] = useState('');

  const messagesContainerRef = useRef(null);
  const inputWrapperRef = useRef(null);

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

  // Autofocus input when chat opens
  useEffect(() => {
    if (isOpen && inputWrapperRef.current) {
      const inputEl = inputWrapperRef.current.querySelector('input');
      inputEl?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to chat
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
      // Call your backend API with { question: input }
      const res = await fetch('http://127.0.0.1:8001/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      // Add bot's answer to chat
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
          <div className="chatbot-input-area" ref={inputWrapperRef}>
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              rightButtons={<Button text="Send" onClick={handleSend} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
