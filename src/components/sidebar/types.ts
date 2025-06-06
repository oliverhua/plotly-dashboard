import type { FolderStructure } from '../../utils/dataUtils';

export interface SidebarProps {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedTestcase: string;
  selectedFile?: string;
}

export interface SidebarContentProps {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedTestcase: string;
}

export interface FolderItemProps {
  folder: string;
  testcases: { [testcase: string]: readonly string[] };
  isSelected: boolean;
  selectedTestcase: string;
}

export interface TestcaseItemProps {
  folder: string;
  testcase: string;
  isSelected: boolean;
}

export interface FileItemProps {
  folder: string;
  file: string;
  isSelected: boolean;
}
