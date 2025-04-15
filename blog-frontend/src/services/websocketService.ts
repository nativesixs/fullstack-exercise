import { config } from '../config';

interface WebSocketOptions {
  url: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const createWebSocketConnection = (options: WebSocketOptions) => {
  let isConnected = false;
  let socket: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  const connect = () => {
    if (socket || !config.ENABLE_WEBSOCKETS) return;

    try {
      socket = new WebSocket(options.url);

      socket.onopen = () => {
        console.log('WebSocket connection established');
        isConnected = true;
        if (options.onOpen) options.onOpen();
      };

      socket.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          data = event.data;
        }
        options.onMessage(data);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        isConnected = false;
        socket = null;
        
        if (options.onClose) options.onClose();
        
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (options.onError) options.onError(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    
    if (socket) {
      socket.close();
      socket = null;
      isConnected = false;
    }
  };

  return {
    connect,
    disconnect,
    isConnected: () => isConnected,
  };
};
