import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Badge,
  TableContainer,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { formatDate } from '../../utils/dateUtils';
import { Article } from '../../types/article';
import { SortField, SortDirection, SortConfig } from '../../utils/articleSorting';

// Re-export SortField for compatibility
export type { SortField } from '../../utils/articleSorting';

interface ArticleTableProps {
  articles: Article[];
  sort: SortConfig;
  onSort: (field: SortField) => void;
  onEdit: (articleId: string) => void;
  onDelete: (articleId: string) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  sort,
  onSort,
  onEdit,
  onDelete,
}) => {
  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? (
      <TriangleUpIcon boxSize={3} ml={1} />
    ) : (
      <TriangleDownIcon boxSize={3} ml={1} />
    );
  };

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th 
              cursor="pointer" 
              onClick={() => onSort('title')}
              userSelect="none"
            >
              <Flex align="center">
                Article Title
                {getSortIcon('title')}
              </Flex>
            </Th>
            <Th 
              cursor="pointer" 
              onClick={() => onSort('createdAt')}
              userSelect="none"
            >
              <Flex align="center">
                Created At
                {getSortIcon('createdAt')}
              </Flex>
            </Th>
            <Th>Author</Th>
            <Th 
              cursor="pointer" 
              onClick={() => onSort('comments')}
              userSelect="none"
            >
              <Flex align="center">
                Comments
                {getSortIcon('comments')}
              </Flex>
            </Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {articles.length === 0 ? (
            <Tr>
              <Td colSpan={5} textAlign="center" py={8}>
                No articles found. Create your first article!
              </Td>
            </Tr>
          ) : (
            articles.map((article) => (
              <Tr key={article.articleId}>
                <Td py={4}>{article.title}</Td>
                <Td py={4}>{formatDate(article.createdAt)}</Td>
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
                      onClick={() => onEdit(article.articleId)}
                    />
                    <IconButton
                      aria-label="Delete article"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(article.articleId)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ArticleTable;
