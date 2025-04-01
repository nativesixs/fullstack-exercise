import { Comment } from '../types/comment';

interface CommentEvent {
  changeType: 'commentCreated' | 'commentUpVoted' | 'commentDownVoted';
  comment: Comment;
}

type CommentEventCallback = (event: CommentEvent) => void;

export class WebSocketService {
  private listeners: CommentEventCallback[] = [];

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.handleMockMessage = this.handleMockMessage.bind(this);
    
    window.addEventListener('mockWsMessage', this.handleMockMessage as EventListener);
    console.log('Mock WebSocket service initialized');
  }

  public connect(): void {
    console.log('Mock WebSocket connected');
  }

  public disconnect(): void {
    console.log('Mock WebSocket disconnected');
  }

  public subscribe(callback: CommentEventCallback): void {
    console.log('Subscribing to mock WebSocket events');
    this.listeners.push(callback);
  }

  public unsubscribe(callback: CommentEventCallback): void {
    console.log('Unsubscribing from mock WebSocket events');
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
  
  private handleMockMessage(event: Event): void {
    try {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail as CommentEvent;
      
      if (data && data.changeType && data.comment) {
        console.log('Mock WebSocket message received:', data);
        this.listeners.forEach(listener => listener(data));
      }
    } catch (error) {
      console.error('Error handling mock WebSocket message:', error);
    }
  }
}
