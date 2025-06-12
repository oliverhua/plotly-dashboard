export interface BarChartTask {
  task: string;
  start: number;
  duration: number;
  resource: string;
  metrics: {
    [key: string]: {
      value: number;
      label: string;
    };
  };
}

export interface BarChartData {
  tasks: BarChartTask[];
  metadata: {
    folder: string;
    generatedAt: string;
    totalTasks: number;
  };
}

/**
 * 獲取正確的資料路徑
 */
function getDataPath(folderName: string): string {
  // 動態獲取當前的 base path
  // 如果當前 URL 包含 /plotly-dashboard/，則使用該前綴
  // 否則使用相對路徑
  const currentPath = window.location.pathname;
  const basePath = currentPath.includes('/plotly-dashboard/') ? '/plotly-dashboard' : '';
  return `${basePath}/data/testitem/${folderName}_gantt.json`;
}

/**
 * 載入長條圖資料
 */
export async function loadBarChartData(folderName: string): Promise<BarChartData> {
  const dataPath = getDataPath(folderName);
  
  try {
    console.log(`Attempting to load bar chart data from: ${dataPath}`);
    const response = await fetch(dataPath);
    
    if (!response.ok) {
      const errorMessage = `Failed to load bar chart data for ${folderName}: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      console.error(`Request URL: ${dataPath}`);
      throw new Error(errorMessage);
    }

    // 檢查響應的 Content-Type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Unexpected content type: ${contentType}`);
      console.error(`Response URL: ${response.url}`);
      
      // 嘗試讀取響應內容以獲得更多資訊
      const responseText = await response.text();
      console.error(`Response content (first 200 chars): ${responseText.substring(0, 200)}`);
      
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
    }
    
    const data = await response.json();
    
    // 驗證資料結構
    if (!data.tasks || !Array.isArray(data.tasks)) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid bar chart data structure: missing tasks array');
    }
    
    if (!data.metadata) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid bar chart data structure: missing metadata');
    }
    
    console.log(`Successfully loaded bar chart data for ${folderName}:`, {
      tasksCount: data.tasks.length,
      folder: data.metadata.folder,
      generatedAt: data.metadata.generatedAt
    });
    
    return data as BarChartData;
  } catch (error) {
    console.error('Error loading bar chart data:', {
      folderName,
      dataPath,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * 檢查長條圖資料是否存在
 */
export async function checkBarChartDataExists(folderName: string): Promise<boolean> {
  const dataPath = getDataPath(folderName);
  
  try {
    console.log(`Checking if bar chart data exists: ${dataPath}`);
    const response = await fetch(dataPath, {
      method: 'HEAD'
    });
    
    const exists = response.ok;
    console.log(`Bar chart data exists for ${folderName}: ${exists}`);
    return exists;
  } catch (error) {
    console.error('Error checking bar chart data existence:', {
      folderName,
      dataPath,
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}

/**
 * 獲取所有可用的長條圖資料夾
 */
export async function getAvailableBarChartFolders(): Promise<string[]> {
  try {
    // 這裡我們可以根據配置來獲取可用的資料夾
    // 暫時返回已知的資料夾
    const folders = ['DVFS_Latency', 'Power_On_Latency'];
    const availableFolders: string[] = [];
    
    console.log('Checking available bar chart folders...');
    
    for (const folder of folders) {
      const exists = await checkBarChartDataExists(folder);
      if (exists) {
        availableFolders.push(folder);
      }
    }
    
    console.log('Available bar chart folders:', availableFolders);
    return availableFolders;
  } catch (error) {
    console.error('Error getting available bar chart folders:', error);
    return [];
  }
} 