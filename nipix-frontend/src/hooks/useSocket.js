import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (userId) {
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
      socketRef.current.emit('joinUserRoom', userId);

      socketRef.current.on('receiveMessage', (message) => {
        console.log('New message received:', message);
        // Dispatch to Redux message slice here
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};

export default useSocket;