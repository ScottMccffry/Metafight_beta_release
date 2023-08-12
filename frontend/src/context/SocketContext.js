import { createContext, useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = socketIOClient(API_BASE_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      console.log('Closing socket connection');
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };