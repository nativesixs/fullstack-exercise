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
  TableContainer,
  Badge,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles, deleteArticle } from '../../store/actions/articleActions';
import LoadingState from '../../components/LoadingState';
import Pagination from '../../components/Pagination';

const ITEMS_PER_PAGE = 10;

type SortField = 'title' | 'perex' | 'author' | 'comments';
type SortDirection = 'asc' | 'desc';

const AdminArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<any>(null);
  
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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

  const handleSortChange = (field: SortField, direction?: SortDirection) => {
    if (field === sortField && !direction) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(direction || 'asc');
    }
    setCurrentPage(1);
  };

  const sortedArticles = [...(articles || [])].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortField) {
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'perex':
        valueA = a.perex.toLowerCase();
        valueB = b.perex.toLowerCase();
        break;
      case 'author':
        valueA = 'admin';
        valueB = 'admin';
        break;
      case 'comments':
        valueA = 0;
        valueB = 0;
        break;
      default:
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  const renderSortableHeader = (field: SortField, label: string) => {
    const isActive = sortField === field;
    
    return (
      <Th py={4} cursor="pointer" _hover={{ bg: 'gray.100' }}>
        <Flex align="center" justify="space-between">
          <Text>{label}</Text>
          <HStack spacing={1}>
            <Icon 
              as={TriangleUpIcon} 
              w={3} 
              h={3}
              color={isActive && sortDirection === 'asc' ? 'blue.500' : 'gray.400'}
              onClick={() => handleSortChange(field, 'asc')}
              cursor="pointer"
              _hover={{ color: 'blue.400' }}
            />
            <Icon 
              as={TriangleDownIcon} 
              w={3} 
              h={3}
              color={isActive && sortDirection === 'desc' ? 'blue.500' : 'gray.400'}
              onClick={() => handleSortChange(field, 'desc')}
              cursor="pointer"
              _hover={{ color: 'blue.400' }}
            />
          </HStack>
        </Flex>
      </Th>
    );
  };

  return (
    <Box>
      <Flex mb={6} alignItems="center">
        <Heading as="h1" size="lg" color="gray.800" mr={4}>My Articles</Heading>
        <Button 
          as={RouterLink} 
          to="/admin/new-article" 
          colorScheme="blue" 
          leftIcon={<span>+</span>}
          display={{ base: 'none', md: 'flex' }}
        >
          Create New Article
        </Button>
        
        {/* Mobile create button*/}
        <Box mb={6} display={{ base: 'block', md: 'none' }} w="100%" ml={4}>
          <Button 
            as={RouterLink} 
            to="/admin/new-article" 
            colorScheme="blue" 
            leftIcon={<span>+</span>}
            width="full"
          >
            Create New Article
          </Button>
        </Box>
      </Flex>

      {!articles || articles.length === 0 ? (
        <Box bg="white" p={8} borderRadius="md" textAlign="center" boxShadow="sm">
          <Text>No articles found. Create your first article!</Text>
        </Box>
      ) : (
        <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  {renderSortableHeader('title', 'Article Title')}
                  {renderSortableHeader('perex', 'Perex')}
                  {renderSortableHeader('author', 'Author')}
                  {renderSortableHeader('comments', '# of Comments')}
                  <Th py={4} width="120px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedArticles.map((article) => (
                  <Tr key={article.articleId} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="medium" py={4}>{article.title}</Td>
                    <Td noOfLines={2} py={4} color="gray.600">{article.perex}</Td>
                    <Td py={4}>Admin</Td>
                    <Td py={4}>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        0
                      </Badge>
                    </Td>
                    <Td py={4}>
                      <Flex gap={2}>
                        <IconButton
                          aria-label="Edit article"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleEdit(article.articleId)}
                        />
                        <IconButton
                          aria-label="Delete article"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(article.articleId)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          <Box py={4} px={6} bg="white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>
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
