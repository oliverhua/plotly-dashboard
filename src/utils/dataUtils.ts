export interface HeatmapData {
  z: number[][];
  x: string[];
  y: string[];
}

export interface FolderStructure {
  readonly [folderName: string]: readonly string[];
}

// 導入生成的文件結構
import { folderStructure } from './folderStructure';
import requestManager from './requestManager';
import { createCacheKey } from './helpers';

/**
 * Fetch available folders and files structure
 */
export const fetchFolderStructure = async (): Promise<FolderStructure> => {
  try {
    // 直接返回生成的文件結構
    return folderStructure;
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    return {};
  }
};

/**
 * Fetch heatmap data for a specific folder and file using the global RequestManager
 */
export const fetchHeatmapData = async (folder: string, filename: string): Promise<HeatmapData | null> => {
  try {
    // Generate cache key for this request
    const cacheKey = createCacheKey(folder, filename);
    
    // Use the correct path with the base URL
    const baseUrl = import.meta.env.BASE_URL || '/plotly-dashboard/';
    // Ensure we don't have double slashes in the path
    const dataPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/${folder}/${filename}`;
    
    console.log(`Requesting data from: ${dataPath}`);
    
    // Use the request manager to fetch data - it handles caching, deduplication and abort control
    const data = await requestManager.fetchData(dataPath, cacheKey);
    
    return data as HeatmapData;
  } catch (error) {
    console.error(`Error fetching heatmap data for ${folder}/${filename}:`, error);
    return null;
  }
}; 