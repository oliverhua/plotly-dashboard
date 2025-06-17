import fs from 'fs';
import path from 'path';

// 讀取 plotly_config.json
const plotlyConfig = JSON.parse(fs.readFileSync(path.resolve('src/config/plotly_config.json'), 'utf8'));

// 生成文件結構
function generateFolderStructure() {
  const dataDir = path.resolve('public/data');
  const folderStructure = {};

  // 讀取所有文件夾，排除 testitem 資料夾
  const folders = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name !== 'testitem') // 排除 testitem 資料夾
    .sort();

  // 讀取每個文件夾中的testcase子目錄和文件
  for (const folder of folders) {
    const folderPath = path.join(dataDir, folder);
    folderStructure[folder] = {};

    // 檢查是否有子目錄（testcase）
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    const subdirs = items
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    if (subdirs.length > 0) {
      // 有子目錄的情況（新的層次結構）
      for (const testcase of subdirs) {
        const testcasePath = path.join(folderPath, testcase);
        const files = fs
          .readdirSync(testcasePath)
          .filter(file => path.extname(file) === '.json')
          .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.match(/\d+/)?.[0] || '0');
            return numA - numB;
          });
        folderStructure[folder][testcase] = files;
      }
    } else {
      // 沒有子目錄的情況（舊的平面結構，向後兼容）
      const files = items
        .filter(
          dirent => dirent.isFile() && path.extname(dirent.name) === '.json'
        )
        .map(dirent => dirent.name)
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });

      // 為了向後兼容，將文件放在一個默認的testcase中
      if (files.length > 0) {
        folderStructure[folder]['default'] = files;
      }
    }
  }

  return folderStructure;
}

// 計算熱圖平均值
function calculateHeatmapAverages(heatmapData) {
  const zValues = heatmapData.z.flat();
  const zValueAverage = zValues.reduce((sum, val) => sum + val, 0) / zValues.length;

  const metricsAverages = {};
  if (heatmapData.additionalMetrics) {
    Object.entries(heatmapData.additionalMetrics).forEach(([key, metric]) => {
      const values = metric.values.flat();
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      metricsAverages[key] = {
        value: average,
        label: metric.label || key
      };
    });
  }

  return {
    zValue: zValueAverage,
    metrics: metricsAverages
  };
}

// 生成長條圖資料
function generateBarChartData(folderStructure) {
  const barChartData = [];
  
  Object.keys(folderStructure).forEach(folderName => {
    const folderData = folderStructure[folderName];
    
    Object.keys(folderData).forEach(testcase => {
      const files = folderData[testcase];
      
      files.forEach(filename => {
        const filePath = path.join('public/data', folderName, testcase, filename);
        
        if (fs.existsSync(filePath)) {
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const heatmapData = JSON.parse(fileContent);
            
            // 只處理有額外指標的資料
            if (heatmapData.additionalMetrics) {
              const averages = calculateHeatmapAverages(heatmapData);
              
              // 使用 plotly_config.json 中的設定來獲取顯示名稱
              const testItemName = plotlyConfig.displayNames.files[filename] || filename.replace('.json', '');
              
              barChartData.push({
                testItem: testItemName,
                testcase: testcase,
                folder: folderName,
                zValueAverage: averages.zValue,
                metricsAverages: averages.metrics,
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            console.warn(`Error processing file ${filePath}:`, error.message);
          }
        }
      });
    });
  });
  
  return barChartData;
}

// 創建長條圖資料夾和檔案
function createBarChartDataStructure(barChartData) {
  const barChartDir = path.resolve('public/data/testitem');
  
  // 確保目錄存在
  if (!fs.existsSync(barChartDir)) {
    fs.mkdirSync(barChartDir, { recursive: true });
  }
  
  // 按資料夾分組長條圖資料
  const groupedData = {};
  barChartData.forEach(item => {
    if (!groupedData[item.folder]) {
      groupedData[item.folder] = [];
    }
    groupedData[item.folder].push(item);
  });
  
  // 為每個資料夾創建長條圖檔案
  Object.keys(groupedData).forEach(folderName => {
    const folderBarChartData = groupedData[folderName];
    const barChartFilePath = path.join(barChartDir, `${folderName}_gantt.json`);
    
    // 轉換為長條圖格式
    const barChartData = {
      tasks: folderBarChartData.map((item, index) => ({
        task: item.testItem,
        start: index * 100, // 模擬開始時間
        duration: item.zValueAverage, // 使用 z 值平均作為持續時間
        resource: item.testcase,
        metrics: item.metricsAverages
      })),
      metadata: {
        folder: folderName,
        generatedAt: new Date().toISOString(),
        totalTasks: folderBarChartData.length
      }
    };
    
    fs.writeFileSync(barChartFilePath, JSON.stringify(barChartData, null, 2));
    console.log(`Generated bar chart data: ${barChartFilePath}`);
  });
  
  return groupedData;
}

// 主函數
function main() {
  console.log('Starting configuration update...');
  
  const folderStructure = generateFolderStructure();
  
  // 生成長條圖資料
  console.log('\nGenerating bar chart data...');
  const barChartData = generateBarChartData(folderStructure);
  
  if (barChartData.length > 0) {
    const groupedBarChartData = createBarChartDataStructure(barChartData);
    console.log(`\nBar chart data generated successfully!`);
    console.log(`- Total test items processed: ${barChartData.length}`);
    console.log(`- Bar charts created for folders: ${Object.keys(groupedBarChartData).join(', ')}`);
  } else {
    console.log('\nNo test items with additional metrics found for bar chart generation.');
  }
  
  console.log('\nConfiguration update completed!');
}

main(); 