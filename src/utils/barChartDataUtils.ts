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
 * 載入長條圖資料
 */
export async function loadBarChartData(folderName: string): Promise<BarChartData> {
  try {
    const response = await fetch(`/plotly-dashboard/data/testitem/${folderName}_gantt.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load bar chart data for ${folderName}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 驗證資料結構
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid bar chart data structure: missing tasks array');
    }
    
    if (!data.metadata) {
      throw new Error('Invalid bar chart data structure: missing metadata');
    }
    
    return data as BarChartData;
  } catch (error) {
    console.error('Error loading bar chart data:', error);
    throw error;
  }
}

/**
 * 檢查長條圖資料是否存在
 */
export async function checkBarChartDataExists(folderName: string): Promise<boolean> {
  try {
    const response = await fetch(`/plotly-dashboard/data/testitem/${folderName}_gantt.json`, {
      method: 'HEAD'
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking bar chart data existence:', error);
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
    
    for (const folder of folders) {
      const exists = await checkBarChartDataExists(folder);
      if (exists) {
        availableFolders.push(folder);
      }
    }
    
    return availableFolders;
  } catch (error) {
    console.error('Error getting available bar chart folders:', error);
    return [];
  }
} 