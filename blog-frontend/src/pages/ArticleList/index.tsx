import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Select,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles } from '../../store/actions/articleActions';
import ApiKeySetup from '../../components/ApiKeySetup';
import ArticleCard from '../../components/ArticleCard';
import Pagination from '../../components/Pagination';
import LoadingState from '../../components/LoadingState';

const ITEMS_PER_PAGE = 5;

const ArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    dispatch(fetchArticles({}));
  }, [dispatch]);

  const sortedArticles = [...(articles || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'newest' | 'oldest');
    setCurrentPage(1);
  };

  if (loading) {
    return <LoadingState text="Loading articles..." fullPage />;
  }

  if (error && error.includes('API key')) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Recent Articles</Heading>
        <Text color="red.500" mb={4}>Error: {error}</Text>
        <Button 
          colorScheme="blue" 
          onClick={() => setIsApiKeyModalOpen(true)}
        >
          Set API Key
        </Button>
        <ApiKeySetup 
          isOpen={isApiKeyModalOpen} 
          onClose={() => setIsApiKeyModalOpen(false)} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Recent Articles</Heading>
        <Text color="red.500" mb={4}>Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">Recent Articles</Heading>
        <Box>
          <Select 
            value={sortOrder} 
            onChange={handleSortChange} 
            width="200px"
            bg="white"
            borderColor="gray.300"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Select>
        </Box>
      </Flex>
      
      {!articles || articles.length === 0 ? (
        <Box bg="white" p={8} borderRadius="md" textAlign="center">
          <Text>No articles found.</Text>
        </Box>
      ) : (
        <>
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
};

export default ArticleList;
