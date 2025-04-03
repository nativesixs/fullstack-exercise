import { useState, useMemo } from 'react';
import { Article } from '../types/article';
import { SortField, SortDirection } from '../utils/articleSorting';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
}

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  sortField: SortField;
  sortDirection: SortDirection;
  paginatedArticles: Article[];
  handlePageChange: (page: number) => void;
  handleSortChange: (field: SortField) => void;
}

/**
 * Hook for handling article pagination and sorting
 */
export function useArticlePagination(
  articles: Article[],
  initialState: Partial<PaginationState> = {}
): PaginationResult {
  const [currentPage, setCurrentPage] = useState(initialState.currentPage || 1);
  const [itemsPerPage] = useState(initialState.itemsPerPage || 10);
  const [sortField, setSortField] = useState<SortField>(initialState.sortField || 'createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    initialState.sortDirection || 'desc'
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const { sortedArticles, paginatedArticles, totalPages } = useMemo(() => {
    const sorted = [...articles].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'comments':
          const aCount = 'comments' in a ? (a as any).comments?.length || 0 : 0;
          const bCount = 'comments' in b ? (b as any).comments?.length || 0 : 0;
          comparison = aCount - bCount;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

    return {
      sortedArticles: sorted,
      paginatedArticles: paginated,
      totalPages,
    };
  }, [articles, currentPage, itemsPerPage, sortField, sortDirection]);

  return {
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    paginatedArticles,
    handlePageChange,
    handleSortChange,
  };
}
