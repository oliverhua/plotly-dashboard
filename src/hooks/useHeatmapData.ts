import { useCallback, useEffect, useRef, useState } from 'react';

import { ERROR_MESSAGES } from '../constants';
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

export const useHeatmapData = (
  initialFolder?: string,
  initialFile?: string
): UseHeatmapDataResult => {
  // State for folder structure
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [isStructureLoaded, setIsStructureLoaded] = useState(false);

  // State for current selection
  const [selectedFolder, setSelectedFolderState] = useState<string>('');
  const [selectedFile, setSelectedFileState] = useState<string>('');

  // State for data
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to track initialization and previous values
  const isInitialized = useRef(false);
  const previousSelectionRef = useRef({ folder: '', file: '' });

  // Handle data loading
  const loadData = useCallback(async (folder: string, file: string) => {
    if (!folder || !file) return;

    const selectionKey = `${folder}/${file}`;
    console.log(`Loading data for ${selectionKey}`);

    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchHeatmapData(folder, file);
      setHeatmapData(data);
    } catch (err: unknown) {
      console.error(`Error loading data for ${selectionKey}:`, err);
      setHeatmapData(null);
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.LOAD_HEATMAP;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load folder structure once on mount
  useEffect(() => {
    if (!isInitialized.current) {
      const loadStructure = async () => {
        console.log('Loading folder structure (once)');
        try {
          const structure = await fetchFolderStructure();
          setFolderStructure(structure);
          setIsStructureLoaded(true);

          // Set default selections
          const folders = Object.keys(structure);
          if (folders.length > 0) {
            // Use initial values from props if valid, otherwise use defaults
            let folder = initialFolder || '';
            let file = initialFile || '';

            // If initial values aren't valid, use first available
            if (!folder || !structure[folder]) {
              folder = folders[0];
            }

            if (!file || !structure[folder]?.includes(file)) {
              file = structure[folder]?.[0] || '';
            }

            console.log(`Initial selection: ${folder}/${file}`);
            setSelectedFolderState(folder);
            setSelectedFileState(file);
            previousSelectionRef.current = { folder, file };

            // Initial data load
            loadData(folder, file);
          }

          isInitialized.current = true;
        } catch (err) {
          console.error('Error loading structure:', err);
          setError(ERROR_MESSAGES.LOAD_STRUCTURE);
        }
      };

      loadStructure();
    }
  }, [initialFolder, initialFile, loadData]);

  // Update based on URL parameters (if they're valid and different from current selection)
  useEffect(() => {
    if (
      isStructureLoaded &&
      initialFolder &&
      initialFile
    ) {
      // Only update if the URL parameters are different from current state
      const isNewSelection = 
        initialFolder !== selectedFolder || 
        initialFile !== selectedFile;
      
      // Only proceed if it's actually a new selection
      if (isNewSelection) {
        // Verify parameters are valid
        if (
          folderStructure[initialFolder] &&
          folderStructure[initialFolder].includes(initialFile)
        ) {
          console.log(`URL params changed to ${initialFolder}/${initialFile}`);
          setSelectedFolderState(initialFolder);
          setSelectedFileState(initialFile);
          previousSelectionRef.current = {
            folder: initialFolder,
            file: initialFile,
          };

          // Load data for new selection
          loadData(initialFolder, initialFile);
        }
      }
    }
  }, [
    initialFolder,
    initialFile,
    isStructureLoaded,
    folderStructure,
    selectedFolder,
    selectedFile,
    loadData,
  ]);

  // Handlers for changing selections
  const setSelectedFolder = useCallback(
    (folder: string) => {
      if (folder === selectedFolder) return;

      console.log(`Folder changed to ${folder}`);
      setSelectedFolderState(folder);

      // Find a valid file in the folder
      const files = folderStructure[folder] || [];
      if (files.length > 0) {
        const newFile = files[0];
        setSelectedFileState(newFile);
        previousSelectionRef.current = { folder, file: newFile };

        // Load data for new selection
        loadData(folder, newFile);
      }
    },
    [selectedFolder, folderStructure, loadData]
  );

  const setSelectedFile = useCallback(
    (file: string) => {
      if (file === selectedFile) return;

      console.log(`File changed to ${file}`);
      setSelectedFileState(file);
      previousSelectionRef.current = { folder: selectedFolder, file };

      // Load data for new selection
      if (selectedFolder) {
        loadData(selectedFolder, file);
      }
    },
    [selectedFile, selectedFolder, loadData]
  );

  return {
    folderStructure,
    selectedFolder,
    selectedFile,
    heatmapData,
    isLoading,
    error,
    setSelectedFolder,
    setSelectedFile,
  };
};
