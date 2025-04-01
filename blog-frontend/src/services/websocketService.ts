import { Comment } from '../types/comment';
import { config } from '../config';
import { WebSocketService as MockWebSocketService } from './mockWebsocketService';

interface CommentEvent {
  changeType: 'commentCreated' | 'commentUpVoted' | 'commentDownVoted';
  comment: Comment;
}

type CommentEventCallback = (event: CommentEvent) => void;

class RealWebSocketService {
  private socket: WebSocket | null = null;
  private listeners: CommentEventCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    try {
      this.socket = new WebSocket('wss://fullstack.exercise.applifting.cz/ws');
      
      this.socket.addEventListener('message', this.handleMessage);
      this.socket.addEventListener('close', this.handleClose);
      this.socket.addEventListener('error', this.handleError);

      this.socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      });
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeEventListener('message', this.handleMessage);
      this.socket.removeEventListener('close', this.handleClose);
      this.socket.removeEventListener('error', this.handleError);
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  public subscribe(callback: CommentEventCallback): void {
    this.listeners.push(callback);

    if (this.listeners.length === 1) {
      this.connect();
    }
  }

  public unsubscribe(callback: CommentEventCallback): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);

    if (this.listeners.length === 0) {
      this.disconnect();
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as CommentEvent;
      
      if (data && data.changeType && data.comment) {
        this.listeners.forEach(listener => listener(data));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.reconnectTimeout) {
      return;
    }

    this.reconnectAttempts++;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }
}

const websocketService = config.USE_MOCKS 
  ? new MockWebSocketService()
  : new RealWebSocketService();

export default websocketService;
