// 導入生成的文件結構
import { ERROR_MESSAGES } from '../constants';

import { folderStructure } from './folderStructure';
import { createCacheKey } from './helpers';
import requestManager from './requestManager';

export interface HeatmapData {
  z: number[][];
  x: string[];
  y: string[];
}

export interface TestcaseHeatmapData {
  filename: string;
  data: HeatmapData;
}

export interface TestcaseData {
  testcase: string;
  heatmaps: TestcaseHeatmapData[];
}

export interface FolderStructure {
  readonly [folderName: string]: {
    readonly [testcase: string]: readonly string[];
  };
}

/**
 * Fetch available folders and files structure
 */
export const fetchFolderStructure = async (): Promise<FolderStructure> => {
  try {
    // 直接返回生成的文件結構
    return folderStructure;
  } catch (error) {
    console.error('Error fetching folder structure:', error);
    return {};
  }
};

/**
 * Fetch heatmap data for a specific folder and file using the global RequestManager
 */
export const fetchHeatmapData = async (
  folder: string,
  file: string
): Promise<HeatmapData> => {
  // Validate inputs
  if (!folder || !file) {
    throw new Error('Invalid folder or file parameters');
  }

  // Generate cache key for this request
  const cacheKey = createCacheKey(folder, file);

  // Use the correct path with the base URL
  const baseUrl = import.meta.env.BASE_URL || '/plotly-dashboard/';
  const dataPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/${folder}/${file}`;

  try {
    const data = await requestManager.fetchData(dataPath, cacheKey);
    return data as HeatmapData;
  } catch (error) {
    console.error(`Failed to fetch data from ${dataPath}:`, error);
    throw new Error(ERROR_MESSAGES.LOAD_HEATMAP);
  }
};

/**
 * Fetch all heatmap data for a specific testcase
 */
export const fetchTestcaseData = async (
  folder: string,
  testcase: string
): Promise<TestcaseData> => {
  // Validate inputs
  if (!folder || !testcase) {
    throw new Error('Invalid folder or testcase parameters');
  }

  const structure = await fetchFolderStructure();
  const files = structure[folder]?.[testcase];

  if (!files || files.length === 0) {
    throw new Error(`No files found for ${folder}/${testcase}`);
  }

  try {
    // Fetch all heatmap data for this testcase
    const heatmapPromises = files.map(async file => {
      const baseUrl = import.meta.env.BASE_URL || '/plotly-dashboard/';
      const dataPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/${folder}/${testcase}/${file}`;
      const cacheKey = createCacheKey(folder, `${testcase}/${file}`);

      const data = await requestManager.fetchData(dataPath, cacheKey);
      return {
        filename: file,
        data: data as HeatmapData,
      };
    });

    const heatmaps = await Promise.all(heatmapPromises);

    return {
      testcase,
      heatmaps,
    };
  } catch (error) {
    console.error(
      `Failed to fetch testcase data for ${folder}/${testcase}:`,
      error
    );
    throw new Error(ERROR_MESSAGES.LOAD_HEATMAP);
  }
};
