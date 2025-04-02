import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Flex,
  Text,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles, deleteArticle } from '../../store/actions/articleActions';
import { selectAllArticles } from '../../store/slices/articlesEntitySlice';
import LoadingState from '../../components/LoadingState';
import Pagination from '../../components/Pagination';
import ArticleTable from '../../components/ArticleTable';
import DeleteArticleDialog from '../../components/DeleteArticleDialog';
import { SortConfig, sortArticles, toggleSort, SortField } from '../../utils/articleSorting';

const ITEMS_PER_PAGE = 10;

const AdminArticleList: React.FC = () => {
  // Get articles from the entity adapter selectors
  const articles = useSelector(selectAllArticles);
  const { loading, error } = useSelector((state: RootState) => state.articles);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchArticles({}));
    }
  }, [dispatch, isAuthenticated]);

  const handleEdit = (articleId: string) => {
    navigate(`/admin/articles/${articleId}`);
  };

  const handleDelete = (articleId: string) => {
    setArticleToDelete(articleId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (articleToDelete) {
      try {
        await dispatch(deleteArticle(articleToDelete)).unwrap();
        toast({
          title: 'Article deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete article',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        onClose();
        setArticleToDelete(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (field: SortField) => {
    setSort(prevSort => toggleSort(prevSort, field));
  };

  // Pagination and sorting
  const sortedArticles = sortArticles(articles, sort);
  const totalItems = sortedArticles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <LoadingState height="50vh" text="Loading articles..." />
    );
  }

  if (error) {
    return (
      <Box>
        <Heading as="h1" mb={4}>My Articles</Heading>
        <Text color="red.500" mb={4}>{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="lg">My Articles</Heading>
        <Button 
          as={RouterLink} 
          to="/admin/new-article" 
          colorScheme="blue"
        >
          Create New Article
        </Button>
      </Flex>

      {articles.length === 0 ? (
        <Box bg="white" borderRadius="md" p={8} textAlign="center">
          <Text fontSize="lg" mb={6}>You haven't created any articles yet</Text>
          <Button 
            as={RouterLink} 
            to="/admin/new-article" 
            colorScheme="blue"
          >
            Create Your First Article
          </Button>
        </Box>
      ) : (
        <Box borderRadius="md" overflow="hidden" bg="white" boxShadow="sm">
          <ArticleTable 
            articles={paginatedArticles} 
            sort={sort}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <Box py={4} px={6} bg="white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>
      )}

      <DeleteArticleDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default AdminArticleList;
