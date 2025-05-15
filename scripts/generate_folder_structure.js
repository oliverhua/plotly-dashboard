import fs from 'fs';
import path from 'path';

// 生成文件結構
function generateFolderStructure() {
  const dataDir = path.resolve('public/data');
  const folderStructure = {};
  
  // 讀取所有文件夾
  const folders = fs.readdirSync(dataDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
  
  // 讀取每個文件夾中的文件
  for (const folder of folders) {
    const folderPath = path.join(dataDir, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => path.extname(file) === '.json')
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    folderStructure[folder] = files;
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