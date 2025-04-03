import { config } from '../config';
import { Comment } from '../types/comment';

type CommentCallback = (comment: Comment) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: CommentCallback[] = [];
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnecting: boolean = false;

  connect = () => {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const apiKey = localStorage.getItem(config.API_KEY_STORAGE_KEY);
      if (!apiKey) {
        console.error('API Key is missing');
        this.isConnecting = false;
        return;
      }

      const wsUrl = config.API_URL.replace(/^http/, 'ws');
      this.ws = new WebSocket(`${wsUrl}/ws?apiKey=${apiKey}`);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnecting = false;
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const comment = JSON.parse(event.data) as Comment;
          this.notifySubscribers(comment);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnecting = false;
        if (!this.reconnectInterval) {
          this.reconnectInterval = setInterval(() => {
            this.connect();
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnecting = false;
    }
  };

  disconnect = () => {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnecting = false;
  };

  subscribeToComments = (callback: CommentCallback) => {
    if (!this.subscribers.includes(callback)) {
      this.subscribers.push(callback);
    }
  };

  unsubscribeFromComments = (callback: CommentCallback) => {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  };

  private notifySubscribers = (comment: Comment) => {
    this.subscribers.forEach(callback => {
      try {
        callback(comment);
      } catch (error) {
        console.error('Error in comment subscriber:', error);
      }
    });
  };

  send = (data: any) => {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  };
}

const websocketService = new WebSocketService();
export default websocketService;
