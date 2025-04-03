import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import CommentsSection from '../../components/CommentsSection';
import * as commentApi from '../../api/commentApi';
import { Comment } from '../../types/comment';

// Mock the commentApi
jest.mock('../../api/commentApi');
const mockPostComment = commentApi.postComment as jest.MockedFunction<typeof commentApi.postComment>;

// Mock Redux store
const mockStore = configureStore();

// Sample comments for testing
const mockComments: Comment[] = [
  {
    commentId: '1',
    articleId: 'test-article-id',
    author: 'John Doe',
    content: 'This is a test comment',
    postedAt: '2023-01-01T12:00:00Z',
    score: 5,
  },
  {
    commentId: '2',
    articleId: 'test-article-id',
    author: 'Jane Smith',
    content: 'Another test comment',
    postedAt: '2023-01-02T12:00:00Z',
    score: 3,
  },
];

// Configure mock store
const store = mockStore({
  auth: {
    isAuthenticated: false,
    loading: false,
    error: null,
  },
});

const authenticatedStore = mockStore({
  auth: {
    isAuthenticated: true,
    loading: false,
    error: null,
  },
});

// Helper function to render the component
const renderComponent = (articleId = 'test-article-id', comments: Comment[] = [], isAuthenticated = false) => {
  const storeToUse = isAuthenticated ? authenticatedStore : store;
  
  return render(
    <BrowserRouter>
      <Provider store={storeToUse}>
        <ChakraProvider>
          <CommentsSection articleId={articleId} comments={comments} />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  );
};

describe('CommentsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPostComment.mockResolvedValue({
      commentId: 'new-comment-id',
      articleId: 'test-article-id',
      author: 'Admin',
      content: 'Test comment',
      postedAt: new Date().toISOString(),
      score: 0,
    });
  });

  it('renders the component with "Comments" heading when no comments provided', () => {
    renderComponent();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  it('renders the component with comments when comments are provided', () => {
    renderComponent('test-article-id', mockComments);
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Another test comment')).toBeInTheDocument();
  });

  it('renders the comment form when user is authenticated', () => {
    renderComponent('test-article-id', [], true);
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('shows join the conversation message when user is not authenticated', () => {
    renderComponent('test-article-id', []);
    expect(screen.getByText('Want to join the conversation?')).toBeInTheDocument();
    expect(screen.getByText('log in')).toBeInTheDocument();
  });

  it('calls postComment when form is submitted with content', async () => {
    renderComponent('test-article-id', [], true);
    
    const textarea = screen.getByPlaceholderText('Write a comment...');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });
    
    const submitButton = screen.getByRole('button', { name: /post comment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPostComment).toHaveBeenCalledWith({
        articleId: 'test-article-id',
        content: 'Test comment',
        author: 'Admin'
      });
    });
  });
});
