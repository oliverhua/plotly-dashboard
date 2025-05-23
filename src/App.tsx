import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeatmapDisplay from './components/HeatmapDisplay';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { useHeatmapData } from './hooks/useHeatmapData';
import { AnimationContext } from './contexts/AnimationContext';
import { ANIMATION_DURATION } from './constants';
import { formatFolderName, removeFileExtension } from './utils/helpers';

function App() {
  // URL parameters - decode them to handle any URL encoding
  const params = useParams<{ folderParam: string, fileParam: string }>();
  const folderParam = params.folderParam ? decodeURIComponent(params.folderParam) : undefined;
  const fileParam = params.fileParam ? decodeURIComponent(params.fileParam) : undefined;
  const navigate = useNavigate();
  
  const {
    folderStructure,
    selectedFolder,
    selectedFile,
    heatmapData,
    isLoading,
    error,
    setSelectedFolder,
    setSelectedFile,
  } = useHeatmapData(folderParam, fileParam);
  
  // Navigate when selections change - but only if they don't match URL
  useEffect(() => {
    if (selectedFolder && selectedFile) {
      const currentPathFolder = folderParam || '';
      const currentPathFile = fileParam || '';
      
      if (selectedFolder !== currentPathFolder || selectedFile !== currentPathFile) {
        const newPath = `/${encodeURIComponent(selectedFolder)}/${encodeURIComponent(selectedFile)}`;
        console.log(`Updating URL to match selections: ${newPath}`);
        navigate(newPath);
      }
    }
  }, [selectedFolder, selectedFile, navigate, folderParam, fileParam]);
  
  // 添加動畫狀態
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastSelectedFile, setLastSelectedFile] = useState<string | null>(null);
  
  // 添加頁面標題動畫效果
  const [titleClass, setTitleClass] = useState('');
  
  useEffect(() => {
    if (isAnimating) {
      setTitleClass('text-blue-600 scale-105 origin-left');
      
      const timer = setTimeout(() => {
        setTitleClass('');
      }, ANIMATION_DURATION);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Memoize AnimationContext value to prevent unnecessary re-renders
  const animationContextValue = useMemo(() => ({ 
    isAnimating, 
    setIsAnimating, 
    lastSelectedFile, 
    setLastSelectedFile 
  }), [isAnimating, lastSelectedFile]);

  // Memoize class names
  const headerClassName = useMemo(() => 
    `bg-white border-b border-gray-100 py-4 px-6 transition-colors duration-300 ${
      isAnimating ? 'bg-gray-50' : ''
    }`,
    [isAnimating]
  );

  const titleClassName = useMemo(() => 
    `text-xl font-semibold text-gray-800 transition-all duration-300 ${titleClass}`,
    [titleClass]
  );

  const mainClassName = useMemo(() => 
    `flex-1 p-6 overflow-auto border-l border-gray-100 transition-colors duration-300 ${
      isAnimating ? 'bg-gray-100' : 'bg-gray-50'
    }`,
    [isAnimating]
  );

  const titleContainerClassName = useMemo(() => 
    `mb-6 transition-all duration-300 ${
      isAnimating ? 'transform translate-y-1' : ''
    }`,
    [isAnimating]
  );

  const contentTitleClassName = useMemo(() => 
    `text-lg font-medium transition-colors duration-300 ${
      isAnimating ? 'text-blue-700' : 'text-gray-800'
    }`,
    [isAnimating]
  );

  const heatmapContainerClassName = useMemo(() => 
    `bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-500 ${
      isAnimating ? 'shadow-md border-blue-100' : 'border-gray-100'
    }`,
    [isAnimating]
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className={headerClassName}>
        <div className="flex items-center justify-between">
          <h1 className={titleClassName}>
            Heatmap Data Visualization
          </h1>
        </div>
      </header>

      <ErrorBoundary>
      <AnimationContext.Provider value={animationContextValue}>
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 h-full">
            <Sidebar
              folderStructure={folderStructure}
              selectedFolder={selectedFolder}
              selectedFile={selectedFile}
              onFolderChange={setSelectedFolder}
              onFileChange={setSelectedFile}
              isLoading={isLoading}
            />
          </div>
          
          {/* Main Content Area */}
          <main className={mainClassName}>
            <div className="max-w-6xl mx-auto">
              <div className={titleContainerClassName}>
                <h2 className={contentTitleClassName}>
                  {selectedFolder && selectedFile 
                      ? `${formatFolderName(selectedFolder)} - ${removeFileExtension(selectedFile)}`
                    : 'Heatmap Visualization'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFolder && selectedFile 
                    ? 'Interactive heatmap visualization'
                    : 'Select a folder and file from the sidebar to view heatmap data'}
                </p>
              </div>
              
              <div className={heatmapContainerClassName}>
                <HeatmapDisplay
                  data={heatmapData}
                  isLoading={isLoading}
                  error={error}
                  selectedFile={selectedFile}
                />
              </div>
            </div>
          </main>
        </div>
      </AnimationContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default React.memo(App);
