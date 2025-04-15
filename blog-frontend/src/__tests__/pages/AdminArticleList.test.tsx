import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AdminArticleList from '../../pages/AdminArticleList';
import { fetchArticles } from '../../store/actions/articleActions';
import createMockStore from '../../utils/testing/mockStore';

jest.mock('../../store/actions/articleActions', () => ({
  fetchArticles: jest.fn(() => ({ type: 'articles/fetchArticles/fulfilled' })),
  deleteArticle: jest.fn(() => ({ type: 'articles/deleteArticle/fulfilled' })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../store/slices/articlesEntitySlice', () => ({
  selectAllArticles: (state) => state.articles.articles || [],
}));

describe('AdminArticleList Page', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore({
      auth: {
        isAuthenticated: true,
      },
      articles: {
        articles: [
          {
            articleId: 'article-1',
            title: 'Test Article 1',
            perex: 'Test perex 1',
            createdAt: '2023-01-01T12:00:00Z',
          },
          {
            articleId: 'article-2',
            title: 'Test Article 2',
            perex: 'Test perex 2',
            createdAt: '2023-01-02T12:00:00Z',
          },
        ],
        loading: false,
        error: null,
        ids: ['article-1', 'article-2'],
        entities: {
          'article-1': {
            articleId: 'article-1',
            title: 'Test Article 1',
            perex: 'Test perex 1',
            createdAt: '2023-01-01T12:00:00Z',
          },
          'article-2': {
            articleId: 'article-2',
            title: 'Test Article 2',
            perex: 'Test perex 2',
            createdAt: '2023-01-02T12:00:00Z',
          },
        },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <AdminArticleList />
        </BrowserRouter>
      </Provider>
    );
  };

  it('fetches articles on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(fetchArticles).toHaveBeenCalled();
    });
  });

  it('renders the article list', () => {
    renderComponent();

    expect(screen.getByText('My Articles')).toBeInTheDocument();
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  it('shows a "Create New Article" button', () => {
    renderComponent();

    expect(screen.getByText('Create New Article')).toBeInTheDocument();
  });
});
