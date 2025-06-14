import fs from 'fs';
import path from 'path';

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

// 生成預設的顯示名稱
function generateDisplayName(name, type = 'default') {
  if (type === 'testcase' && name === 'default') {
    return 'Default Test Case';
  }
  
  return name.replace(/_/g, ' ')
}

// 自動配置 plotly_config.json
function updatePlotlyConfig(folderStructure) {
  const configPath = path.resolve('src/config/plotly_config.json');
  
  // 從 folderStructure 收集所有的資料夾、testcase 和檔案
  const allFolders = Object.keys(folderStructure);
  const allTestcases = new Set();
  const allFiles = new Set();

  Object.values(folderStructure).forEach(folderData => {
    Object.keys(folderData).forEach(testcase => {
      allTestcases.add(testcase);
      folderData[testcase].forEach(file => {
        allFiles.add(file);
      });
    });
  });

  // 讀取現有配置（如果存在）
  let existingConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('Found existing plotly_config.json, will update it...');
    } catch (error) {
      console.warn('Error reading existing config, will create new one:', error.message);
    }
  }

  // 更新 displayNames
  const displayNames = existingConfig.displayNames || {};
  
  // 更新資料夾顯示名稱
  displayNames.folders = displayNames.folders || {};
  allFolders.forEach(folder => {
    if (!displayNames.folders[folder]) {
      displayNames.folders[folder] = generateDisplayName(folder);
    }
  });

  // 更新 testcase 顯示名稱
  displayNames.testcases = displayNames.testcases || {};
  [...allTestcases].forEach(testcase => {
    if (!displayNames.testcases[testcase]) {
      displayNames.testcases[testcase] = generateDisplayName(testcase, 'testcase');
    }
  });

  // 更新檔案顯示名稱
  displayNames.files = displayNames.files || {};
  [...allFiles].forEach(file => {
    if (!displayNames.files[file]) {
      const nameWithoutExt = file.replace(/\.[^/.]+$/, '');
      displayNames.files[file] = generateDisplayName(nameWithoutExt);
    }
  });

  // 更新 chartSettings
  const chartSettings = existingConfig.chartSettings || {};
  
  // 更新軸標籤
  chartSettings.axisLabels = chartSettings.axisLabels || {
    xAxisTitle: "To PF State",
    yAxisTitle: "From PF State"
  };

  // 更新長條圖軸標籤
  chartSettings.barChartAxisLabels = chartSettings.barChartAxisLabels || {
    xAxisTitle: "Test Items (Heatmaps)",
    yAxisTitle: "Time(us)"
  };

  // 更新標題設定
  chartSettings.titles = chartSettings.titles || {
    defaultPrefix: "",
    defaultSuffix: ""
  };

  // 更新 zAxisRanges
  chartSettings.zAxisRanges = chartSettings.zAxisRanges || {};
  allFolders.forEach(folder => {
    if (!chartSettings.zAxisRanges[folder]) {
      chartSettings.zAxisRanges[folder] = {
        zmin: 0,
        zmax: 200
      };
    }
  });
  
  // 確保有默認值
  if (!chartSettings.zAxisRanges.default) {
    chartSettings.zAxisRanges.default = {
      zmin: 0,
      zmax: 200
    };
  }

  // 更新 additionalMetrics
  chartSettings.additionalMetrics = chartSettings.additionalMetrics || {};
  
  // 為每個資料夾設置 additionalMetrics
  allFolders.forEach(folder => {
    if (!chartSettings.additionalMetrics[folder]) {
      // 根據資料夾名稱設置不同的配置
      if (folder === 'DVFS_Latency') {
        chartSettings.additionalMetrics[folder] = {
          enabled: true,
          labels: ["CPU Usage", "Memory Usage", "Disk I/O", "Network I/O", "Power Consumption"],
          colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
          maxValue: 100
        };
      } else {
        chartSettings.additionalMetrics[folder] = {
          enabled: false,
          labels: ["Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5"],
          colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
          maxValue: 100
        };
      }
    }
  });

  // 確保有默認值
  if (!chartSettings.additionalMetrics.default) {
    chartSettings.additionalMetrics.default = {
      enabled: false,
      labels: ["Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5"],
      colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
      maxValue: 100
    };
  }

  // 更新 fallbackSettings
  const fallbackSettings = existingConfig.fallbackSettings || {
    removeFileExtension: true,
    replaceUnderscoreWithSpace: true,
    capitalizeFirstLetter: true
  };

  // 建立完整的配置物件
  const plotlyConfig = {
    displayNames,
    chartSettings,
    fallbackSettings
  };

  // 確保 config 目錄存在
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // 寫入檔案
  fs.writeFileSync(configPath, JSON.stringify(plotlyConfig, null, 2));
  
  // 輸出更新統計
  const newFolders = Object.keys(displayNames.folders).length - allFolders.length;
  const newTestcases = Object.keys(displayNames.testcases).length - allTestcases.size;
  const newFiles = Object.keys(displayNames.files).length - allFiles.size;
  
  console.log('plotly_config.json updated successfully!');
  console.log('Configuration summary:');
  console.log(`- Total folders: ${Object.keys(displayNames.folders).length} (${newFolders} new)`);
  console.log(`- Total testcases: ${Object.keys(displayNames.testcases).length} (${newTestcases} new)`);
  console.log(`- Total files: ${Object.keys(displayNames.files).length} (${newFiles} new)`);
}

// 計算陣列的平均值
function calculateAverage(array) {
  if (!array || array.length === 0) return 0;
  const sum = array.reduce((acc, val) => acc + val, 0);
  return sum / array.length;
}

// 計算熱圖資料的平均值
function calculateHeatmapAverages(heatmapData) {
  const averages = {
    zValue: 0,
    metrics: {}
  };

  // 計算 z 值的平均
  if (heatmapData.z && heatmapData.z.length > 0) {
    const allZValues = heatmapData.z.flat().filter(val => val !== null);
    averages.zValue = calculateAverage(allZValues);
  }

  // 計算每個額外指標的平均值
  if (heatmapData.additionalMetrics) {
    Object.keys(heatmapData.additionalMetrics).forEach(metricKey => {
      const metric = heatmapData.additionalMetrics[metricKey];
      if (metric && metric.values) {
        const allMetricValues = metric.values.flat();
        averages.metrics[metricKey] = {
          value: calculateAverage(allMetricValues),
          label: metric.label || metricKey
        };
      }
    });
  }

  return averages;
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
              
              const testItemName = filename.replace('.json', '');
              
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
  updatePlotlyConfig(folderStructure);
  
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

// 執行主函數
main(); 