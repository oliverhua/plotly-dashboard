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

// 自動配置 plotly_config.json
function autoConfigPlotlyConfig(folderStructure) {
  const configPath = path.resolve('src/config/plotly_config.json');
  
  // 檢查檔案是否存在
  if (fs.existsSync(configPath)) {
    console.log('plotly_config.json already exists, skipping auto-configuration.');
    return;
  }

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

  // 建立預設的 displayNames
  const folderDisplayNames = {};
  allFolders.forEach(folder => {
    // 將底線替換為空格，每個單字首字母大寫
    folderDisplayNames[folder] = folder
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

  const testcaseDisplayNames = {};
  [...allTestcases].forEach(testcase => {
    if (testcase === 'default') {
      testcaseDisplayNames[testcase] = 'Default Test Case';
    } else {
      testcaseDisplayNames[testcase] = testcase
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
  });

  const fileDisplayNames = {};
  [...allFiles].forEach(file => {
    // 移除副檔名，將底線替換為空格，首字母大寫
    const nameWithoutExt = file.replace(/\.[^/.]+$/, '');
    fileDisplayNames[file] = nameWithoutExt
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });

  // 建立預設的 zAxisRanges
  const zAxisRanges = {};
  allFolders.forEach(folder => {
    zAxisRanges[folder] = {
      zmin: 0,
      zmax: 200
    };
  });

  // 建立完整的配置物件
  const plotlyConfig = {
    displayNames: {
      folders: folderDisplayNames,
      testcases: testcaseDisplayNames,
      files: fileDisplayNames
    },
    chartSettings: {
      axisLabels: {
        xAxisTitle: "X Axis",
        yAxisTitle: "Y Axis"
      },
      titles: {
        defaultPrefix: "",
        defaultSuffix: " - Performance Heatmap"
      },
      zAxisRanges: {
        ...zAxisRanges,
        default: {
          zmin: 0,
          zmax: 200
        }
      }
    },
    fallbackSettings: {
      removeFileExtension: true,
      replaceUnderscoreWithSpace: true,
      capitalizeFirstLetter: true
    }
  };

  // 確保 config 目錄存在
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // 寫入檔案
  fs.writeFileSync(configPath, JSON.stringify(plotlyConfig, null, 2));
  console.log('plotly_config.json auto-configured successfully!');
  console.log(`Created config for ${allFolders.length} folders, ${allTestcases.size} testcases, and ${allFiles.size} files.`);
}

// 生成 TypeScript 文件
const folderStructure = generateFolderStructure();

// 自動配置 plotly_config.json（如果不存在）
autoConfigPlotlyConfig(folderStructure);

const content = `// This file is auto-generated. Do not edit manually.
export const folderStructure = ${JSON.stringify(folderStructure, null, 2)} as const;
`;

// 寫入文件
fs.writeFileSync('src/utils/folderStructure.ts', content);
console.log('Folder structure generated successfully!');
console.log('Generated structure:', JSON.stringify(folderStructure, null, 2));
