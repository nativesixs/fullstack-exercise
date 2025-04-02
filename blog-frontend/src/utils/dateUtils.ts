import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Format a date string to a display format
 * @param dateString ISO date string
 * @param formatString Optional format string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatString: string = 'MMMM d, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date as relative time (e.g. "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return dateString;
  }
};

/**
 * Format a date with time
 * @param dateString ISO date string
 * @returns Formatted date and time
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return dateString;
  }
};
