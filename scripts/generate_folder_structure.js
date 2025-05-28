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
    const subdirs = items.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name).sort();
    
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
        .filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.json')
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

// 生成 TypeScript 文件
const folderStructure = generateFolderStructure();
const content = `// This file is auto-generated. Do not edit manually.
export const folderStructure = ${JSON.stringify(folderStructure, null, 2)} as const;
`;

// 寫入文件
fs.writeFileSync('src/utils/folderStructure.ts', content);
console.log('Folder structure generated successfully!');
console.log('Generated structure:', JSON.stringify(folderStructure, null, 2));
