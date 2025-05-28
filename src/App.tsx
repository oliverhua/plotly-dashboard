import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import HeatmapDisplay from './components/HeatmapDisplay';
import Sidebar from './components/sidebar/Sidebar';
import {
  ANIMATION_DURATION,
  APP_SUBTITLE,
  APP_TITLE,
  DEFAULT_CONTENT_TITLE,
  INTERACTIVE_DESCRIPTION,
  SELECT_INSTRUCTION,
} from './constants';
import { AnimationContext } from './contexts/AnimationContext';
import { useHeatmapData } from './hooks/useHeatmapData';
import { formatFolderName } from './utils/helpers';

function App() {
  // URL parameters - decode them to handle any URL encoding
  const params = useParams<{ folderParam: string; testcaseParam: string }>();
  const folderParam = params.folderParam
    ? decodeURIComponent(params.folderParam)
    : undefined;
  const testcaseParam = params.testcaseParam
    ? decodeURIComponent(params.testcaseParam)
    : undefined;

  const {
    folderStructure,
    selectedFolder,
    selectedTestcase,
    testcaseData,
    isLoading,
    error,
  } = useHeatmapData(folderParam, testcaseParam);

  // 添加動畫狀態
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastSelectedTestcase, setLastSelectedTestcase] = useState<string | null>(null);

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
  const animationContextValue = useMemo(
    () => ({
      isAnimating,
      setIsAnimating,
      lastSelectedFile: lastSelectedTestcase,
      setLastSelectedFile: setLastSelectedTestcase,
    }),
    [isAnimating, lastSelectedTestcase]
  );

  // Memoize class names
  const headerClassName = useMemo(
    () =>
      `bg-white border-b border-gray-100 py-4 px-6 transition-colors duration-300 ${
        isAnimating ? 'bg-gray-50' : ''
      }`,
    [isAnimating]
  );

  const titleClassName = useMemo(
    () =>
      `text-xl font-semibold text-gray-800 transition-all duration-300 ${titleClass}`,
    [titleClass]
  );

  const mainClassName = useMemo(
    () =>
      `flex-1 p-6 overflow-auto border-l border-gray-100 transition-colors duration-300 ${
        isAnimating ? 'bg-gray-100' : 'bg-gray-50'
      }`,
    [isAnimating]
  );

  const titleContainerClassName = useMemo(
    () =>
      `mb-6 transition-all duration-300 ${
        isAnimating ? 'transform translate-y-1' : ''
      }`,
    [isAnimating]
  );

  const contentTitleClassName = useMemo(
    () =>
      `text-lg font-medium transition-colors duration-300 ${
        isAnimating ? 'text-blue-700' : 'text-gray-800'
      }`,
    [isAnimating]
  );

  const heatmapContainerClassName = useMemo(
    () =>
      `bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-500 ${
        isAnimating ? 'shadow-md border-blue-100' : 'border-gray-100'
      }`,
    [isAnimating]
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className={headerClassName}>
        <div className="flex items-center justify-between">
          <h1 className={titleClassName}>{APP_TITLE}</h1>
          <p className="text-sm text-gray-600">{APP_SUBTITLE}</p>
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
                selectedTestcase={selectedTestcase}
              />
            </div>

            {/* Main Content Area */}
            <main className={mainClassName}>
              <div className="max-w-6xl mx-auto">
                <div className={titleContainerClassName}>
                  <h2 className={contentTitleClassName}>
                    {selectedFolder && selectedTestcase
                      ? `${formatFolderName(selectedFolder)} - ${selectedTestcase}`
                      : DEFAULT_CONTENT_TITLE}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedFolder && selectedTestcase
                      ? INTERACTIVE_DESCRIPTION
                      : SELECT_INSTRUCTION}
                  </p>
                </div>

                <div className={heatmapContainerClassName}>
                  <HeatmapDisplay
                    testcaseData={testcaseData}
                    isLoading={isLoading}
                    error={error}
                    selectedTestcase={selectedTestcase}
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
