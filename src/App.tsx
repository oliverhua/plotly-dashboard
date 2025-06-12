import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import HeatmapDisplay from './components/HeatmapDisplay';
import BarChart from './components/BarChart';
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
import { loadBarChartData, checkBarChartDataExists, type BarChartData } from './utils/barChartDataUtils';

type TabType = 'heatmap' | 'barChart';

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

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('heatmap');
  
  // Bar chart data state
  const [barChartData, setBarChartData] = useState<BarChartData | null>(null);
  const [barChartLoading, setBarChartLoading] = useState(false);
  const [barChartError, setBarChartError] = useState<string | null>(null);
  const [barChartAvailable, setBarChartAvailable] = useState(false);

  // 添加動畫狀態
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastSelectedTestcase, setLastSelectedTestcase] = useState<
    string | null
  >(null);

  // Check bar chart data availability when folder changes
  useEffect(() => {
    if (selectedFolder) {
      checkBarChartDataExists(selectedFolder).then(exists => {
        setBarChartAvailable(exists);
        if (!exists && activeTab === 'barChart') {
          setActiveTab('heatmap');
        }
      });
    }
  }, [selectedFolder, activeTab]);

  // Load bar chart data when bar chart tab is selected
  useEffect(() => {
    if (activeTab === 'barChart' && selectedFolder && barChartAvailable) {
      setBarChartLoading(true);
      setBarChartError(null);
      
      loadBarChartData(selectedFolder)
        .then(data => {
          setBarChartData(data);
          setBarChartError(null);
        })
        .catch(error => {
          console.error('Failed to load bar chart data:', error);
          setBarChartError(error.message || 'Failed to load bar chart data');
          setBarChartData(null);
        })
        .finally(() => {
          setBarChartLoading(false);
        });
    }
  }, [activeTab, selectedFolder, barChartAvailable]);

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

  const contentContainerClassName = useMemo(
    () =>
      `px-6 pb-6 transition-all duration-300 ${
        isAnimating ? 'bg-gray-50' : 'bg-white'
      }`,
    [isAnimating]
  );

  // Tab button component
  const TabButton = ({ 
    tab, 
    label, 
    disabled = false 
  }: { 
    tab: TabType; 
    label: string; 
    disabled?: boolean;
  }) => (
    <button
      onClick={() => !disabled && setActiveTab(tab)}
      disabled={disabled}
      className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow-sm'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
      {disabled && ' (N/A)'}
    </button>
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={contentTitleClassName}>
                        {selectedFolder && selectedTestcase
                          ? activeTab === 'heatmap' 
                            ? `${formatFolderName(selectedFolder)} - ${testcaseDisplayName}`
                            : `${formatFolderName(selectedFolder)} - ${testcaseDisplayName} Report`
                          : DEFAULT_CONTENT_TITLE}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedFolder && selectedTestcase
                          ? activeTab === 'heatmap'
                            ? INTERACTIVE_DESCRIPTION
                            : `Aggregated metrics report for ${testcaseDisplayName}`
                          : SELECT_INSTRUCTION}
                      </p>
                    </div>
                    
                    {/* Tab buttons */}
                    {selectedFolder && selectedTestcase && (
                      <div className="flex space-x-2">
                        <TabButton tab="heatmap" label="Heatmaps" />
                        <TabButton 
                          tab="barChart" 
                          label="Report" 
                          disabled={!barChartAvailable}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={contentContainerClassName}>
                  {activeTab === 'heatmap' ? (
                    <HeatmapDisplay
                      testcaseData={testcaseData}
                      isLoading={isLoading}
                      error={error}
                      selectedTestcase={selectedTestcase}
                      selectedFolder={selectedFolder}
                    />
                  ) : (
                    <BarChart
                      data={barChartData}
                      isLoading={barChartLoading}
                      error={barChartError}
                      selectedFolder={selectedFolder}
                      selectedTestcase={selectedTestcase}
                    />
                  )}
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
