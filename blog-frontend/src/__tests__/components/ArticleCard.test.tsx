import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard';

jest.mock('../../components/ApiImage', () => {
  return function MockApiImage(props: any) {
    return <div data-testid="mock-image">Mock image</div>;
  };
});

describe('ArticleCard', () => {
  const mockArticle = {
    articleId: 'test-article-id',
    title: 'Test Article Title',
    perex: 'This is a test article perex.',
    imageId: 'test-image-id',
    createdAt: '2023-01-01T12:00:00Z',
    lastUpdatedAt: '2023-01-01T12:00:00Z',
  };

  it('renders article image', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <ArticleCard article={mockArticle} />
        </BrowserRouter>
      </ChakraProvider>
    );

    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('renders a link to the article detail page', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <ArticleCard article={mockArticle} />
        </BrowserRouter>
      </ChakraProvider>
    );

    const link = screen.getByText('Read whole article');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', `/articles/${mockArticle.articleId}`);
  });
});
