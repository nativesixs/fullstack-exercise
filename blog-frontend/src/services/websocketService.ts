import config from '../config';

export interface Comment {
  commentId: string;
  articleId: string;
  author: string;
  content: string;
  postedAt: string;
  score: number;
}

export interface WebSocketService {
  connect(): void;
  disconnect(): void;
  subscribeToComments(callback: (comment: Comment) => void): void;
  unsubscribeFromComments(): void;
}

class RealWebSocketService implements WebSocketService {
  private socket: WebSocket | null = null;
  private commentCallback: ((comment: Comment) => void) | null = null;
  private currentArticleId: string | null = null;

  connect(): void {
    if (!config.ENABLE_WEBSOCKETS) return;

    try {
      this.socket = new WebSocket('wss://fullstack.exercise.applifting.cz/ws');
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'comment' && this.commentCallback && data.payload.articleId === this.currentArticleId) {
            this.commentCallback(data.payload);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribeToComments(callback: (comment: Comment) => void): void {
    this.commentCallback = callback;
  }

  unsubscribeFromComments(): void {
    this.commentCallback = null;
  }

  setArticleId(articleId: string): void {
    this.currentArticleId = articleId;
  }
}

const websocketService: WebSocketService = new RealWebSocketService();

export default websocketService;
