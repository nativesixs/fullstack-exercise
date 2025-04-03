import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import CommentsSection from '../../components/CommentsSection';
import { postComment } from '../../api/commentApi';
import { Comment } from '../../types/comment';
import createMockStore from '../../utils/testing/mockStore';

jest.mock('../../api/commentApi', () => ({
  postComment: jest.fn(),
  upvoteComment: jest.fn(),
  downvoteComment: jest.fn(),
  getComments: jest.fn()
}));

jest.mock('../../hooks/useWebSocketComments', () => ({
  __esModule: true,
  default: (articleId, initialComments = []) => ({
    comments: initialComments,
    addComment: jest.fn()
  })
}));

const mockComments: Comment[] = [
  {
    commentId: '1',
    articleId: 'test-article-id',
    author: 'John Doe',
    content: 'This is a test comment',
    postedAt: '2023-01-01T12:00:00Z',
    score: 5
  },
  {
    commentId: '2',
    articleId: 'test-article-id',
    author: 'Jane Smith',
    content: 'Another test comment',
    postedAt: '2023-01-02T12:00:00Z',
    score: 3
  }
];

const renderComponent = (
  articleId = 'test-article-id',
  comments: Comment[] = [],
  isAuthenticated = false
) => {
  const store = createMockStore({
    auth: { isAuthenticated }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider>
          <CommentsSection articleId={articleId} comments={comments} />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('CommentsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (postComment as jest.Mock).mockResolvedValue({
      commentId: 'new-comment-id',
      articleId: 'test-article-id',
      content: 'Test comment',
      author: 'Current User',
      postedAt: new Date().toISOString(),
      score: 0
    });
  });

  it('renders the component with "Comments (0)" when no comments provided', () => {
    renderComponent();
    expect(screen.getByText(/comments \(0\)/i)).toBeInTheDocument();
  });

  it('renders the component with "Comments (2)" when 2 comments provided', () => {
    renderComponent('test-article-id', mockComments);
    expect(screen.getByText(/comments \(2\)/i)).toBeInTheDocument();

    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Another test comment')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders the comment form when user is authenticated', () => {
    renderComponent('test-article-id', [], true);
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('shows authentication required message when user is not authenticated', () => {
    renderComponent('test-article-id', []);
    expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
  });

  it('calls postComment when form is submitted with content', async () => {
    renderComponent('test-article-id', [], true);
    
    const commentInput = screen.getByPlaceholderText(/write a comment/i);
    const submitButton = screen.getByRole('button', { name: /post comment/i });

    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(postComment).toHaveBeenCalledWith({
        articleId: 'test-article-id',
        content: 'Test comment'
      });
    });

    expect(commentInput).toHaveValue('');
  });
});
