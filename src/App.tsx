import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import HeatmapDisplay from './components/HeatmapDisplay';
import Sidebar from './components/sidebar/Sidebar';
import {
  APP_SUBTITLE,
  APP_TITLE,
  DEFAULT_CONTENT_TITLE,
  INTERACTIVE_DESCRIPTION,
  SELECT_INSTRUCTION,
} from './constants';
import { AnimationContext } from './contexts/AnimationContext';
import { useHeatmapData } from './hooks/useHeatmapData';
import { formatFolderName } from './utils/helpers';
import { getTestcaseDisplayName } from './utils/configUtils';

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
  const [lastSelectedTestcase, setLastSelectedTestcase] = useState<
    string | null
  >(null);

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

  // Get testcase display name
  const testcaseDisplayName = useMemo(
    () => selectedTestcase ? getTestcaseDisplayName(selectedTestcase) : '',
    [selectedTestcase]
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
    () => `text-xl font-semibold text-gray-800`,
    []
  );

  const mainClassName = useMemo(
    () =>
      `flex-1 overflow-y-auto transition-all duration-300 ${
        isAnimating ? 'bg-gray-50' : 'bg-white'
      }`,
    [isAnimating]
  );

  const titleContainerClassName = useMemo(
    () =>
      `px-6 py-4 transition-all duration-300 ${
        isAnimating ? 'bg-gray-50' : 'bg-white'
      }`,
    [isAnimating]
  );

  const contentTitleClassName = useMemo(
    () =>
      `text-2xl font-semibold text-gray-800 transition-all duration-300 ${
        isAnimating ? 'scale-105' : 'scale-100'
      }`,
    [isAnimating]
  );

  const heatmapContainerClassName = useMemo(
    () =>
      `px-6 pb-6 transition-all duration-300 ${
        isAnimating ? 'bg-gray-50' : 'bg-white'
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
                      ? `${formatFolderName(selectedFolder)} - ${testcaseDisplayName}`
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
                    selectedFolder={selectedFolder}
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
