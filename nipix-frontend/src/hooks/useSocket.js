import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('nipix_token') || localStorage.getItem('token');
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });
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