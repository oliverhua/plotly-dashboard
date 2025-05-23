import { JSON_EXTENSION } from '../constants';

/**
 * Remove file extension from filename
 */
export const removeFileExtension = (filename: string): string => {
  return filename.replace(JSON_EXTENSION, '');
};

/**
 * Format folder name for display (replace underscores with spaces)
 */
export const formatFolderName = (folderName: string): string => {
  return folderName.replace(/_/g, ' ');
};

/**
 * Sort files by their numeric value
 */
export const sortFilesByNumber = (files: readonly string[]): string[] => {
  return [...files].sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
  });
};

/**
 * Create a debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Check if a value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Create a cache key for requests
 */
export const createCacheKey = (folder: string, file: string): string => {
  return `${folder}/${file}`;
};
