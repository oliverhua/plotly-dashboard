import { useState, useEffect } from 'react';
import { fetchFolderStructure, fetchHeatmapData } from '../utils/dataUtils';
import type { FolderStructure, HeatmapData } from '../utils/dataUtils';

interface UseHeatmapDataResult {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedFile: string;
  heatmapData: HeatmapData | null;
  isLoading: boolean;
  error: string | null;
  setSelectedFolder: (folder: string) => void;
  setSelectedFile: (file: string) => void;
}

export const useHeatmapData = (): UseHeatmapDataResult => {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch folder structure on component mount
  useEffect(() => {
    const loadFolderStructure = async () => {
      try {
        setIsLoading(true);
        const structure = await fetchFolderStructure();
        setFolderStructure(structure);
        
        // Set default selections
        const folders = Object.keys(structure);
        if (folders.length > 0) {
          const defaultFolder = folders[0];
          setSelectedFolder(defaultFolder);
          
          const files = structure[defaultFolder];
          if (files && files.length > 0) {
            setSelectedFile(files[0]);
          }
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load folder structure');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFolderStructure();
  }, []);

  // Fetch heatmap data when selected folder or file changes
  useEffect(() => {
    const loadHeatmapData = async () => {
      if (!selectedFolder || !selectedFile) {
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchHeatmapData(selectedFolder, selectedFile);
        setHeatmapData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load heatmap data');
        setHeatmapData(null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHeatmapData();
  }, [selectedFolder, selectedFile]);

  // Handle folder selection change
  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
    
    // Reset file selection to the first file in the new folder
    const files = folderStructure[folder];
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile('');
    }
  };

  return {
    folderStructure,
    selectedFolder,
    selectedFile,
    heatmapData,
    isLoading,
    error,
    setSelectedFolder: handleFolderChange,
    setSelectedFile,
  };
}; 