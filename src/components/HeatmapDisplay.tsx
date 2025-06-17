import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import MetricsPopup from './MetricsPopup';

import type { Config, Layout } from 'plotly.js';

import {
  ACCESSIBILITY,
  CSS_CLASSES,
  DISPLAY_NAMES,
  ERROR_TITLE,
  LOADING_MESSAGE,
  LOADING_TITLE,
  NO_DATA_MESSAGE,
  NO_DATA_TITLE,
  PLOTLY,
  PLOT_CONFIG,
  PLOT_MARGINS,
  SVG_PATHS,
  TRANSITION_DURATION,
} from '../constants';
import { AnimationContext } from '../contexts/AnimationContext';
import {
  getAxisLabels,
  getChartTitle,
  getTestcaseDisplayName,
  getZAxisRange,
  getAdditionalMetricsConfig,
} from '../utils/configUtils';
import type { TestcaseData } from '../utils/dataUtils';

interface HeatmapDisplayProps {
  testcaseData: TestcaseData | null;
  isLoading: boolean;
  error: string | null;
  selectedTestcase: string;
  selectedFolder: string;
}

interface PopupState {
  x: number;
  y: number;
  values: number[];
  labels: string[];
}

// 提取狀態顯示組件以減少重複代碼
const StatusDisplay = React.memo(
  ({
    icon,
    title,
    message,
    bgColor,
    textColor,
  }: {
    icon: React.ReactNode;
    title: string;
    message: string;
    bgColor: string;
    textColor: string;
  }) => (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="flex flex-col items-center text-center max-w-md">
        <div
          className={`w-16 h-16 ${bgColor} ${textColor} rounded-full flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <div className={`text-lg font-medium ${textColor} mb-2`}>{title}</div>
        <div className="text-gray-600">{message}</div>
      </div>
    </div>
  )
);

StatusDisplay.displayName = 'StatusDisplay';

// Loading indicator
const LoadingIndicator = React.memo(() => (
  <StatusDisplay
    icon={<div className={CSS_CLASSES.LOADING_SPINNER}></div>}
    title={LOADING_TITLE}
    message={LOADING_MESSAGE}
    bgColor="bg-transparent"
    textColor={CSS_CLASSES.COLORS.BLUE.TEXT}
  />
));

LoadingIndicator.displayName = DISPLAY_NAMES.LOADING_INDICATOR;

// Error display
const ErrorDisplay = React.memo(({ message }: { message: string }) => (
  <StatusDisplay
    icon={
      <svg
        className={CSS_CLASSES.ICON_SIZE}
        fill={ACCESSIBILITY.FILL}
        stroke={ACCESSIBILITY.STROKE}
        viewBox={ACCESSIBILITY.VIEWBOX}
        xmlns={ACCESSIBILITY.XMLNS}
      >
        <path
          strokeLinecap={ACCESSIBILITY.STROKE_LINECAP}
          strokeLinejoin={ACCESSIBILITY.STROKE_LINEJOIN}
          strokeWidth={ACCESSIBILITY.STROKE_WIDTH}
          d={SVG_PATHS.ERROR_ICON}
        ></path>
      </svg>
    }
    title={ERROR_TITLE}
    message={message}
    bgColor={CSS_CLASSES.COLORS.RED.BACKGROUND}
    textColor={CSS_CLASSES.COLORS.RED.TEXT}
  />
));

ErrorDisplay.displayName = DISPLAY_NAMES.ERROR_DISPLAY;

// Empty state
const EmptyState = React.memo(() => (
  <StatusDisplay
    icon={
      <svg
        className={CSS_CLASSES.ICON_SIZE}
        fill={ACCESSIBILITY.FILL}
        stroke={ACCESSIBILITY.STROKE}
        viewBox={ACCESSIBILITY.VIEWBOX}
        xmlns={ACCESSIBILITY.XMLNS}
      >
        <path
          strokeLinecap={ACCESSIBILITY.STROKE_LINECAP}
          strokeLinejoin={ACCESSIBILITY.STROKE_LINEJOIN}
          strokeWidth={ACCESSIBILITY.STROKE_WIDTH}
          d={SVG_PATHS.INFO_ICON}
        ></path>
      </svg>
    }
    title={NO_DATA_TITLE}
    message={NO_DATA_MESSAGE}
    bgColor={CSS_CLASSES.COLORS.BLUE.BACKGROUND}
    textColor={CSS_CLASSES.COLORS.BLUE.TEXT}
  />
));

EmptyState.displayName = DISPLAY_NAMES.EMPTY_STATE;

// Individual heatmap component
const SingleHeatmap = React.memo(
  ({
    filename,
    data,
    isAnimating,
    folderName,
  }: {
    filename: string;
    data: { 
      z: number[][]; 
      x: string[]; 
      y: string[]; 
      additionalMetrics?: { 
        [key: string]: { 
          values: number[][]; 
          label?: string; 
        } 
      } 
    };
    isAnimating: boolean;
    folderName: string;
  }) => {
    const [popupState, setPopupState] = useState<PopupState | null>(null);
    const config = getAdditionalMetricsConfig(folderName);

    console.log('SingleHeatmap rendered:', { filename, folderName, config });

    // 監控 popupState 的變化
    useEffect(() => {
      if (popupState) {
        console.log('Popup state changed:', popupState);
      } else {
        console.log('Popup state is null');
      }
    }, [popupState]);

    // Get axis labels from config
    const axisLabels = useMemo(() => getAxisLabels(), []);

    // Get Z-axis range for the current folder
    const zAxisRange = useMemo(() => getZAxisRange(folderName), [folderName]);

    // Plotly configuration
    const plotConfig: Partial<Config> = useMemo(
      () => ({
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: [...PLOTLY.MODE_BAR_BUTTONS_TO_REMOVE],
        displaylogo: false,
        // 確保點擊事件能被觸發
        staticPlot: false,
        editable: false,
        scrollZoom: false,
      }),
      []
    );

    // Layout configuration for individual heatmap
    const layout: Partial<Layout> = useMemo(
      () => ({
        title: {
          text: getChartTitle(filename),
          font: {
            family: PLOT_CONFIG.FONT_FAMILY,
            size: PLOT_CONFIG.TITLE_FONT_SIZE,
          },
        },
        autosize: true,
        margin: {
          l: PLOT_MARGINS.LEFT,
          r: PLOT_MARGINS.RIGHT,
          b: PLOT_MARGINS.BOTTOM,
          t: PLOT_MARGINS.TOP + 40,
          pad: PLOT_MARGINS.PAD,
        },
        font: {
          family: PLOT_CONFIG.FONT_FAMILY,
          size: PLOT_CONFIG.BODY_FONT_SIZE,
          color: PLOT_CONFIG.FONT_COLOR,
        },
        width: undefined,
        height: undefined,
        aspectratio: {
          x: 1,
          y: 1,
        },
        yaxis: {
          autorange: 'reversed',
          title: {
            text: axisLabels.yAxisTitle,
            font: {
              family: PLOT_CONFIG.FONT_FAMILY,
              size: PLOT_CONFIG.BODY_FONT_SIZE,
              color: PLOT_CONFIG.FONT_COLOR,
            },
          },
        },
        xaxis: {
          side: 'top',
          title: {
            text: axisLabels.xAxisTitle,
            font: {
              family: PLOT_CONFIG.FONT_FAMILY,
              size: PLOT_CONFIG.BODY_FONT_SIZE,
              color: PLOT_CONFIG.FONT_COLOR,
            },
          },
        },
        // 確保點擊事件能被觸發
        hovermode: 'closest',
        clickmode: 'event',
      }),
      [filename, axisLabels]
    );

    // Heatmap data
    const plotData = useMemo(() => {
      console.log('Generating plot data:', { data, config });
      
      // Process the data to set diagonal elements to null (where x = y)
      const processedZ = data.z.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          // If this is a diagonal element (x = y) or value is undefined/null, return null
          if (rowIndex === colIndex || value === undefined || value === null) {
            return null;
          }
          return value;
        })
      );

      // Create text data for displaying values on each cell
      const textData = data.z.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          // If this is a diagonal element (x = y) or value is undefined/null, show empty string
          if (rowIndex === colIndex || value === undefined || value === null) {
            return '';
          }
          // Round the value to 1 decimal place for cleaner display
          return (Math.round(value * 10) / 10).toString();
        })
      );

      // Generate numbered labels starting from 0
      // Use the original x and y labels from the JSON data
      const xLabels = data.x;
      const yLabels = data.y;

      return [
        {
          z: processedZ,
          x: xLabels,
          y: yLabels,
          type: PLOTLY.HEATMAP_TYPE,
          colorscale: PLOT_CONFIG.COLORSCALE as unknown as string,
          zmin: zAxisRange.zmin,
          zmax: zAxisRange.zmax,
          showscale: true,
          // Add text annotations to show values on each cell
          text: textData as unknown as string,
          texttemplate: '%{text}',
          textfont: {
            color: 'white',
            size: 12,
            family: PLOT_CONFIG.FONT_FAMILY,
          },
          // Configure how null values are displayed
          hovertemplate:
            'from <b>%{y}</b> to <b>%{x}</b><br>Value: %{z}<extra></extra>',
          // Handle null values by setting them to a specific color
          zmid: null, // Let Plotly handle the middle value automatically
          colorbar: {
            title: {
              text: 'Time(us)',
              side: 'top' as const,
              font: {
                family: PLOT_CONFIG.FONT_FAMILY,
                size: PLOT_CONFIG.BODY_FONT_SIZE,
                color: PLOT_CONFIG.FONT_COLOR,
              },
            },
          },
          // 確保點擊事件能被觸發
          hoverinfo: 'all' as const,
          connectgaps: false,
        },
      ];
    }, [data, zAxisRange]);

    // Plot container style
    const plotContainerStyle = useMemo(
      () => ({
        width: '100%',
        height: '100%',
        transition: `all ${TRANSITION_DURATION.MEDIUM}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        filter: isAnimating ? 'blur(2px)' : 'blur(0px)',
        opacity: isAnimating ? 0.8 : 1,
        transform: isAnimating ? 'scale(0.99)' : 'scale(1)',
      }),
      [isAnimating]
    );

    // Handle plot initialization and add event listeners
    const handlePlotInitialized = (_figure: any, graphDiv: any) => {
      console.log('Plot initialized with graphDiv:', graphDiv);
      
      // 使用 Plotly 的原生事件系統
      if (graphDiv && typeof graphDiv.on === 'function') {
        console.log('Adding plotly_click event listener');
        
        graphDiv.on('plotly_click', (eventData: any) => {
          console.log('=== PLOTLY CLICK EVENT ===');
          console.log('Event data:', eventData);
          
          if (!eventData || !eventData.points || eventData.points.length === 0) {
            console.log('No points in event data');
            return;
          }
          
          if (!data.additionalMetrics || !config.enabled) {
            console.log('No additional metrics or config not enabled');
            return;
          }

          const point = eventData.points[0];
          const xIndex = data.x.indexOf(point.x);
          const yIndex = data.y.indexOf(point.y);
          const zValue = point.z;

          console.log('Indices:', { xIndex, yIndex, zValue });

          if (zValue === null || xIndex === -1 || yIndex === -1) {
            console.log('Invalid indices or null value');
            return;
          }

          const metrics = data.additionalMetrics;
          if (!metrics) {
            console.log('No metrics found');
            return;
          }
          
          // 收集所有指標的值和標籤
          const values: number[] = [];
          const labels: string[] = [];
          
          // 從配置中獲取標籤順序
          const configLabels = config.labels;
          
          // 按照配置順序處理指標
          Object.keys(metrics).forEach((metricKey, index) => {
            const metric = metrics[metricKey];
            if (metric && metric.values && metric.values[yIndex] && metric.values[yIndex][xIndex] !== undefined) {
              const value = metric.values[yIndex][xIndex];
              const validValue = Math.min(Math.max(value, 0), config.maxValue);
              values.push(validValue);
              
              // 使用配置中的標籤，如果沒有則使用資料中的標籤
              const label = configLabels[index] || metric.label || `Metric ${index + 1}`;
              labels.push(label);
            }
          });
          
          if (values.length === 0) {
            console.log('No valid metric values found');
            return;
          }

          // 使用實際的點擊座標
          const clickX = eventData.event?.clientX || 200;
          const clickY = eventData.event?.clientY || 200;

          setPopupState({
            x: clickX,
            y: clickY,
            values: values,
            labels: labels,
          });
          
          console.log('=== PLOTLY CLICK EVENT END ===');
        });
      } else {
        console.log('GraphDiv does not support .on method:', typeof graphDiv.on);
      }
    };

    // Handle close popup
    const handleClosePopup = () => {
      setPopupState(null);
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4">
          {/* Container with square aspect ratio */}
          <div className="w-full aspect-square">
            <Plot
              data={plotData}
              layout={layout}
              config={plotConfig}
              style={plotContainerStyle}
              onInitialized={handlePlotInitialized}
            />
          </div>
        </div>
        {popupState && (
          <MetricsPopup
            x={popupState.x}
            y={popupState.y}
            values={popupState.values}
            labels={popupState.labels}
            folderName={folderName}
            onClose={handleClosePopup}
          />
        )}
      </div>
    );
  }
);

SingleHeatmap.displayName = 'SingleHeatmap';

// The main heatmap display component
const HeatmapDisplay: React.FC<HeatmapDisplayProps> = React.memo(
  ({ testcaseData, isLoading, error, selectedTestcase, selectedFolder }) => {
    const { isAnimating } = useContext(AnimationContext);
    const renderCount = useRef(0);
    renderCount.current += 1;

    // Get display name for selected testcase
    const testcaseDisplayName = useMemo(
      () => getTestcaseDisplayName(selectedTestcase),
      [selectedTestcase]
    );

    // Container class name
    const containerClassName = useMemo(() => {
      let className =
        'w-full h-full p-4 transition-all duration-500 rounded-lg relative ';

      if (isAnimating || isLoading) {
        className += 'bg-gray-50 opacity-90 ';
      } else {
        className += 'bg-white ';
      }

      return className;
    }, [isAnimating, isLoading]);

    // Only show loading indicator when loading
    if (isLoading) {
      return <LoadingIndicator />;
    }

    // Only show error display if error and not loading
    if (error && !isLoading) {
      return <ErrorDisplay message={error} />;
    }

    // Only show empty state if no data and not loading
    if (!testcaseData && !isLoading) {
      return <EmptyState />;
    }

    // Render multiple heatmaps for the testcase
    return (
      <div className={containerClassName}>
        {/* Enhanced background effect for animation */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent z-0 animate-pulse"></div>
        )}

        {/* Testcase title */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {testcaseDisplayName}
          </h3>
          <p className="text-sm text-gray-600">
            {testcaseData?.heatmaps.length || 0} heatmap(s) in this testcase
          </p>
        </div>

        {/* Heatmaps grid */}
        <div className="space-y-6">
          {testcaseData?.heatmaps.map((heatmap, index) => (
            <SingleHeatmap
              key={`${heatmap.filename}-${index}`}
              filename={heatmap.filename}
              data={heatmap.data}
              isAnimating={isAnimating}
              folderName={selectedFolder}
            />
          ))}
        </div>
      </div>
    );
  }
);

HeatmapDisplay.displayName = DISPLAY_NAMES.HEATMAP_DISPLAY;

export default HeatmapDisplay;
