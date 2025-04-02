import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CommentsSection from '../../components/CommentsSection';
import * as commentApi from '../../api/commentApi';

jest.mock('../../api/commentApi', () => ({
  postComment: jest.fn(),
  upvoteComment: jest.fn(),
  downvoteComment: jest.fn()
}));

jest.mock('../../services/websocketService', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}));

const mockStore = configureStore([]);

describe('CommentsSection', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: true
      }
    });
    
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <ChakraProvider>
          <BrowserRouter>
            <CommentsSection 
              articleId="test-article-id" 
              comments={[]} 
              {...props} 
            />
          </BrowserRouter>
        </ChakraProvider>
      </Provider>
    );
  };

  it('renders the component with "Comments (0)" when no comments provided', () => {
    renderComponent();
    expect(screen.getByText('Comments (0)')).toBeInTheDocument();
  });

  it('renders the component with "Comments (2)" when 2 comments provided', () => {
    const comments = [
      {
        commentId: '1',
        articleId: 'test-article-id',
        author: 'Test Author 1',
        content: 'Test Comment 1',
        postedAt: '2023-01-01T12:00:00Z',
        score: 5
      },
      {
        commentId: '2',
        articleId: 'test-article-id',
        author: 'Test Author 2',
        content: 'Test Comment 2',
        postedAt: '2023-01-02T12:00:00Z',
        score: 3
      }
    ];
    
    renderComponent({ comments });
    
    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('Test Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    expect(screen.getByText('Test Comment 2')).toBeInTheDocument();
  });

  it('renders the comment form when user is authenticated', () => {
    renderComponent();
    
    expect(screen.getByText('Add Comment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post Comment/i })).toBeInTheDocument();
  });

  it('shows authentication required message when user is not authenticated', () => {
    store = mockStore({
      auth: {
        isAuthenticated: false
      }
    });
    
    renderComponent();
    
    expect(screen.getByText('Authentication required!')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('calls postComment when form is submitted with content', async () => {
    (commentApi.postComment as jest.Mock).mockResolvedValueOnce({
      commentId: 'new-comment',
      articleId: 'test-article-id',
      author: 'Test User',
      content: 'New test comment',
      postedAt: '2023-01-03T12:00:00Z',
      score: 0
    });
    
    renderComponent();
    
    const textarea = screen.getByPlaceholderText('Share your thoughts...');
    
    fireEvent.change(textarea, { target: { value: 'New test comment' } });
    
    const form = screen.getByRole('form');
    
    await act(async () => {
      fireEvent.submit(form);
    });
    
    await waitFor(() => {
      expect(commentApi.postComment).toHaveBeenCalledWith(
        expect.objectContaining({
          articleId: 'test-article-id',
          content: 'New test comment'
        })
      );
    });
  });
});
