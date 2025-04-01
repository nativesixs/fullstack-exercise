import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  IconButton,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles, deleteArticle } from '../../store/actions/articleActions';
import { format } from 'date-fns';
import LoadingState from '../../components/LoadingState';
import Pagination from '../../components/Pagination';

const ITEMS_PER_PAGE = 10;

const AdminArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>(null);
  
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchArticles({})); // Pass empty object
    }
  }, [dispatch, isAuthenticated]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'newest' | 'oldest');
    setCurrentPage(1);
  };

  // Sort articles
  const sortedArticles = [...(articles || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Paginate articles
  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <LoadingState text="Loading your articles..." fullPage />;
  }

  if (error) {
    return (
      <Box>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1">My Articles</Heading>
        <Flex gap={4}>
          <Select value={sortOrder} onChange={handleSortChange} width="200px">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Select>
          <Button 
            as={RouterLink} 
            to="/admin/new-article" 
            colorScheme="blue"
            leftIcon={<span>+</span>}
          >
            Create New Article
          </Button>
        </Flex>
      </Flex>

      {!articles || articles.length === 0 ? (
        <Text>No articles found. Create your first article!</Text>
      ) : (
        <>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Article Title</Th>
                <Th>Perex</Th>
                <Th>Date</Th>
                <Th width="120px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedArticles.map((article) => (
                <Tr key={article.articleId}>
                  <Td fontWeight="medium">{article.title}</Td>
                  <Td noOfLines={2}>{article.perex}</Td>
                  <Td>{formatDate(article.createdAt)}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Edit article"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEdit(article.articleId)}
                      />
                      <IconButton
                        aria-label="Delete article"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(article.articleId)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Article
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default AdminArticleList;
