import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ArticleDetail from '../../pages/ArticleDetail';
import { fetchArticleById } from '../../store/actions/articleActions';

jest.mock('../../store/actions/articleActions', () => ({
  fetchArticleById: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ articleId: 'article-123' })
}));

jest.mock('../../components/CommentsSection', () => {
  return function MockCommentsSection(props: any) {
    return (
      <div data-testid="mock-comments-section">
        Comments section for article: {props.articleId}
      </div>
    );
  };
});

jest.mock('../../components/ApiImage', () => {
  return function MockApiImage(props: any) {
    return <div data-testid="mock-image">Mock image: {props.alt}</div>;
  };
});

jest.mock('../../config', () => ({
  config: {
    USE_MOCKS: false,
    API_URL: 'https://mocked-api.com'
  }
}));

const mockStore = configureStore([]);

describe('ArticleDetail Page', () => {
  let store: any;
  const mockFetchArticleById = fetchArticleById as jest.MockedFunction<typeof fetchArticleById>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    store = mockStore({
      articles: {
        currentArticle: {
          articleId: 'article-123',
          title: 'Test Article',
          perex: 'This is a test article perex',
          content: '# Test Content\n\nThis is the content of the test article.',
          imageId: 'image-123',
          createdAt: '2023-01-01T12:00:00Z',
          lastUpdatedAt: '2023-01-01T12:00:00Z'
        },
        loading: false,
        error: null
      }
    });
    
    mockFetchArticleById.mockReturnValue({ type: 'articles/fetchArticleById/fulfilled' } as any);
  });

  const renderArticleDetail = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<ArticleDetail />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  };

  it('fetches article data on mount', async () => {
    renderArticleDetail();
    
    await waitFor(() => {
      expect(mockFetchArticleById).toHaveBeenCalledWith('article-123');
    });
  });

  it('renders article title, date, and content', () => {
    renderArticleDetail();
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText(/January 1, 2023/i)).toBeInTheDocument();
    
    const markdownElement = screen.getByTestId('mock-markdown');
    expect(markdownElement).toBeInTheDocument();
    expect(markdownElement.textContent).toContain('This is the content of the test article');
  });

  it('renders the comments section', () => {
    renderArticleDetail();
    
    const commentsSection = screen.getByTestId('mock-comments-section');
    expect(commentsSection).toBeInTheDocument();
    expect(commentsSection).toHaveTextContent('Comments section for article: article-123');
  });

  it('shows loading state when article is loading', () => {
    store = mockStore({
      articles: {
        currentArticle: null,
        loading: true,
        error: null
      }
    });
    
    renderArticleDetail();
    
    expect(screen.getByText(/Loading article/i)).toBeInTheDocument();
  });

  it('shows error message when article loading fails', () => {
    store = mockStore({
      articles: {
        currentArticle: null,
        loading: false,
        error: 'Failed to load article'
      }
    });
    
    renderArticleDetail();
    
    expect(screen.getByText(/Failed to load article/i)).toBeInTheDocument();
  });

  it('shows "Article not found" when article is null but not loading', () => {
    store = mockStore({
      articles: {
        currentArticle: null,
        loading: false,
        error: null
      }
    });
    
    renderArticleDetail();
    
    expect(screen.getByText(/Article not found/i)).toBeInTheDocument();
  });
});
