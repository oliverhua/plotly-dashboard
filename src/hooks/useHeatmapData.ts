import { useCallback, useEffect, useRef, useState } from 'react';

import { ERROR_MESSAGES } from '../constants';
import { fetchFolderStructure, fetchTestcaseData } from '../utils/dataUtils';
import type { FolderStructure, TestcaseData } from '../utils/dataUtils';

interface UseHeatmapDataResult {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedTestcase: string;
  testcaseData: TestcaseData | null;
  isLoading: boolean;
  error: string | null;
  setSelectedFolder: (folder: string) => void;
  setSelectedTestcase: (testcase: string) => void;
}

export const useHeatmapData = (
  initialFolder?: string,
  initialTestcase?: string
): UseHeatmapDataResult => {
  // State for folder structure
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [isStructureLoaded, setIsStructureLoaded] = useState(false);

  // State for current selection
  const [selectedFolder, setSelectedFolderState] = useState<string>('');
  const [selectedTestcase, setSelectedTestcaseState] = useState<string>('');

  // State for data
  const [testcaseData, setTestcaseData] = useState<TestcaseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to track initialization and previous values
  const isInitialized = useRef(false);
  const previousSelectionRef = useRef({ folder: '', testcase: '' });

  // Handle data loading
  const loadData = useCallback(async (folder: string, testcase: string) => {
    if (!folder || !testcase) return;

    const selectionKey = `${folder}/${testcase}`;

    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchTestcaseData(folder, testcase);
      setTestcaseData(data);
    } catch (err: unknown) {
      console.error(`Error loading data for ${selectionKey}:`, err);
      setTestcaseData(null);
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
        try {
          const structure = await fetchFolderStructure();
          setFolderStructure(structure);
          setIsStructureLoaded(true);

          // Set default selections
          const folders = Object.keys(structure);
          if (folders.length > 0) {
            // Use initial values from props if valid, otherwise use defaults
            let folder = initialFolder || '';
            let testcase = initialTestcase || '';

            // If initial values aren't valid, use first available
            if (!folder || !structure[folder]) {
              folder = folders[0];
            }

            const testcases = Object.keys(structure[folder] || {});
            if (!testcase || !structure[folder]?.[testcase]) {
              testcase = testcases[0] || '';
            }

            setSelectedFolderState(folder);
            setSelectedTestcaseState(testcase);
            previousSelectionRef.current = { folder, testcase };

            // Initial data load
            if (folder && testcase) {
              loadData(folder, testcase);
            }
          }

          isInitialized.current = true;
        } catch (err) {
          console.error('Error loading structure:', err);
          setError(ERROR_MESSAGES.LOAD_STRUCTURE);
        }
      };

      loadStructure();
    }
  }, [initialFolder, initialTestcase, loadData]);

  // Update based on URL parameters (if they're valid and different from current selection)
  useEffect(() => {
    if (isStructureLoaded && initialFolder && initialTestcase) {
      // Only update if the URL parameters are different from current state
      const isNewSelection =
        initialFolder !== selectedFolder || initialTestcase !== selectedTestcase;

      // Only proceed if it's actually a new selection
      if (isNewSelection) {
        // Verify parameters are valid
        if (
          folderStructure[initialFolder] &&
          folderStructure[initialFolder][initialTestcase]
        ) {
          setSelectedFolderState(initialFolder);
          setSelectedTestcaseState(initialTestcase);
          previousSelectionRef.current = {
            folder: initialFolder,
            testcase: initialTestcase,
          };

          // Load data for new selection
          loadData(initialFolder, initialTestcase);
        }
      }
    }
  }, [
    initialFolder,
    initialTestcase,
    isStructureLoaded,
    folderStructure,
    selectedFolder,
    selectedTestcase,
    loadData,
  ]);

  // Handlers for changing selections
  const setSelectedFolder = useCallback(
    (folder: string) => {
      if (folder === selectedFolder) return;

      setSelectedFolderState(folder);

      // Find a valid testcase in the folder
      const testcases = Object.keys(folderStructure[folder] || {});
      if (testcases.length > 0) {
        const newTestcase = testcases[0];
        setSelectedTestcaseState(newTestcase);
        previousSelectionRef.current = { folder, testcase: newTestcase };

        // Load data for new selection
        loadData(folder, newTestcase);
      }
    },
    [selectedFolder, folderStructure, loadData]
  );

  const setSelectedTestcase = useCallback(
    (testcase: string) => {
      if (testcase === selectedTestcase) return;

      setSelectedTestcaseState(testcase);
      previousSelectionRef.current = { folder: selectedFolder, testcase };

      // Load data for new selection
      if (selectedFolder) {
        loadData(selectedFolder, testcase);
      }
    },
    [selectedTestcase, selectedFolder, loadData]
  );

  return {
    folderStructure,
    selectedFolder,
    selectedTestcase,
    testcaseData,
    isLoading,
    error,
    setSelectedFolder,
    setSelectedTestcase,
  };
};
