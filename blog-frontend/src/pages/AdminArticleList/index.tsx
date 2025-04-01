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
  Spinner,
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles, deleteArticle } from '../../store/actions/articleActions';
import { format } from 'date-fns';

const AdminArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>(null);
  
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchArticles());
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

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
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
        <Button 
          as={RouterLink} 
          to="/admin/new-article" 
          colorScheme="blue"
          leftIcon={<span>+</span>}
        >
          Create New Article
        </Button>
      </Flex>

      {!articles || articles.length === 0 ? (
        <Text>No articles found. Create your first article!</Text>
      ) : (
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
            {articles.map((article) => (
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
