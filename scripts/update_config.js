import fs from 'fs';
import path from 'path';

// 生成文件結構
function generateFolderStructure() {
  const dataDir = path.resolve('public/data');
  const folderStructure = {};

  // 讀取所有文件夾
  const folders = fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
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
    xAxisTitle: "X Axis",
    yAxisTitle: "Y Axis"
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

// 主函數
function main() {
  const folderStructure = generateFolderStructure();
  updatePlotlyConfig(folderStructure);
}

// 執行主函數
main(); 