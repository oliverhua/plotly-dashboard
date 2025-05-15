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
 * Fetch heatmap data for a specific folder and file
 */
export const fetchHeatmapData = async (folder: string, filename: string): Promise<HeatmapData | null> => {
  try {
    const response = await fetch(`/data/${folder}/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data as HeatmapData;
  } catch (error) {
    console.error(`Error fetching heatmap data for ${folder}/${filename}:`, error);
    return null;
  }
}; 