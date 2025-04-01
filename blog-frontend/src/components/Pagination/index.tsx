import React from 'react';
import { Flex, Button, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // max 5 pages visible, maybe we want more ?
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    
    return pages.slice(currentPage - 3, currentPage + 2);
  };
  
  const visiblePages = getVisiblePages();
  
  if (totalPages <= 1) return null;
  
  return (
    <Flex justify="center" mt={8} align="center">
      <IconButton
        aria-label="Previous page"
        icon={<ChevronLeftIcon />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        variant="outline"
        size="sm"
        mr={2}
      />
      
      {currentPage > 3 && totalPages > 5 && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(1)}
            mr={2}
          >
            1
          </Button>
          {currentPage > 4 && (
            <Text mx={2} color="gray.500">
              ...
            </Text>
          )}
        </>
      )}
      
      {visiblePages.map(page => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? 'solid' : 'outline'}
          colorScheme={currentPage === page ? 'blue' : 'gray'}
          onClick={() => onPageChange(page)}
          mx={1}
        >
          {page}
        </Button>
      ))}
      
      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          {currentPage < totalPages - 3 && (
            <Text mx={2} color="gray.500">
              ...
            </Text>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            ml={2}
          >
            {totalPages}
          </Button>
        </>
      )}
      
      <IconButton
        aria-label="Next page"
        icon={<ChevronRightIcon />}
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        ml={2}
      />
    </Flex>
  );
};

export default Pagination;
