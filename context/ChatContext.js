// introspect-ai/context/ChatContext.js
"use client"

import React, { createContext, useState, useContext } from 'react';

// Define the context
export const ChatContext = createContext();

// Create a provider component
export const ChatProvider = ({ children }) => {
  const [chatMessages, setChatMessages] = useState([]);

  // Function to add a message to the array
  const addMessage = (message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  // Function to clear all messages
  const clearMessages = () => {
    setChatMessages([]);
  };
  
  

  return (
    <ChatContext.Provider value={{ chatMessages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};