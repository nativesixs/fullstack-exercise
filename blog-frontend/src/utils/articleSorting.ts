import { Article } from '../types/article';

export type SortField = 'title' | 'createdAt' | 'comments';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

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

export const toggleSort = (currentSort: SortConfig, newField: SortField): SortConfig => {
  if (currentSort.field === newField) {
    return {
      field: newField,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
    };
  } else {
    return {
      field: newField,
      direction: 'desc'
    };
  }
};
