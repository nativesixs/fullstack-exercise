import { Article } from '../types/article';

export type SortField = 'title' | 'createdAt' | 'comments';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Sort articles based on the provided sort configuration
 */
export const sortArticles = (articles: Article[], sort: SortConfig): Article[] => {
  if (!articles || articles.length === 0) return [];
  
  const sortedArticles = [...articles];
  
  sortedArticles.sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'comments':
        // Since comments might not be directly on the Article object, use 0 as fallback
        const aCount = 'comments' in a ? (a as any).comments?.length || 0 : 0;
        const bCount = 'comments' in b ? (b as any).comments?.length || 0 : 0;
        comparison = aCount - bCount;
        break;
      default:
        comparison = 0;
    }
    
    return sort.direction === 'asc' ? comparison : -comparison;
  });
  
  return sortedArticles;
};

/**
 * Toggle sort direction or set it for a new field
 */
export const toggleSort = (currentSort: SortConfig, newField: SortField): SortConfig => {
  if (currentSort.field === newField) {
    // Toggle direction if same field
    return {
      field: newField,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    };
  } else {
    // Default to descending for new field
    return {
      field: newField,
      direction: 'desc'
    };
  }
};
