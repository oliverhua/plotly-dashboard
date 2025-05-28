import type { FolderStructure } from '../../utils/dataUtils';

export interface SidebarProps {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedFile: string;
}

export interface FolderItemProps {
  folder: string;
  files: readonly string[];
  isSelected: boolean;
  selectedFile: string;
}

export interface FileItemProps {
  folder: string;
  file: string;
  isSelected: boolean;
}
