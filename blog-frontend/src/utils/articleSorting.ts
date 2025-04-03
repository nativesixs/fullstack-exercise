import { Article } from '../types/article';

export type SortField = 'title' | 'createdAt' | 'lastUpdatedAt' | 'perex' | 'comments';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export const toggleSort = (currentSort: SortConfig, field: SortField): SortConfig => {
  if (currentSort.field === field) {
    return {
      field,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    };
  } else {
    return {
      field,
      direction: 'desc',
    };
  }
};

export const sortArticles = (articles: Article[], sort: SortConfig): Article[] => {
  return [...articles].sort((a, b) => {
    switch (sort.field) {
      case 'title': {
        const result = a.title.localeCompare(b.title);
        return sort.direction === 'asc' ? result : -result;
      }
      case 'createdAt': {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      case 'lastUpdatedAt':
        if (!a.lastUpdatedAt || !b.lastUpdatedAt) {
          return sort.direction === 'asc' ? -1 : 1;
        }
        return sort.direction === 'asc'
          ? new Date(a.lastUpdatedAt).getTime() - new Date(b.lastUpdatedAt).getTime()
          : new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
      case 'perex':
        return sort.direction === 'asc'
          ? a.perex.localeCompare(b.perex)
          : b.perex.localeCompare(a.perex);
      case 'comments':
        return 0;
      default:
        return 0;
    }
  });
};
