import React, { useContext, useMemo, useRef } from 'react';
import Plot from 'react-plotly.js';

import type { Config, Layout } from 'plotly.js';

import {
  ACCESSIBILITY,
  CSS_CLASSES,
  DISPLAY_NAMES,
  ERROR_TITLE,
  JSON_EXTENSION,
  LOADING_MESSAGE,
  LOADING_TITLE,
  NO_DATA_MESSAGE,
  NO_DATA_TITLE,
  PLOTLY,
  PLOT_CONFIG,
  PLOT_HEIGHT,
  PLOT_MARGINS,
  SVG_PATHS,
  TRANSITION_DURATION,
} from '../constants';
import { AnimationContext } from '../contexts/AnimationContext';
import type { HeatmapData } from '../utils/dataUtils';

interface HeatmapDisplayProps {
  data: HeatmapData | null;
  isLoading: boolean;
  error: string | null;
  selectedFile: string;
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

// The main heatmap display component
const HeatmapDisplay: React.FC<HeatmapDisplayProps> = React.memo(
  ({ data, isLoading, error, selectedFile }) => {
    const { isAnimating } = useContext(AnimationContext);
    const renderCount = useRef(0);
    renderCount.current += 1;

    // Layout configuration
    const layout: Partial<Layout> = useMemo(
      () => ({
        title: {
          text: selectedFile.replace(JSON_EXTENSION, ''),
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
          t: PLOT_MARGINS.TOP,
          pad: PLOT_MARGINS.PAD,
        },
        height: PLOT_HEIGHT,
        font: {
          family: PLOT_CONFIG.FONT_FAMILY,
          size: PLOT_CONFIG.BODY_FONT_SIZE,
          color: PLOT_CONFIG.FONT_COLOR,
        },
      }),
      [selectedFile]
    );

    // Plotly configuration
    const plotConfig: Partial<Config> = useMemo(
      () => ({
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: [...PLOTLY.MODE_BAR_BUTTONS_TO_REMOVE],
        displaylogo: false,
      }),
      []
    );

    // Container class name - add blur when loading
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

    // Heatmap data
    const plotData = useMemo(() => {
      if (!data) return [];

      return [
        {
          z: data.z,
          x: data.x,
          y: data.y,
          type: PLOTLY.HEATMAP_TYPE,
          colorscale: PLOT_CONFIG.COLORSCALE,
          showscale: true,
        },
      ];
    }, [data]);

    // Plot container style - enhanced animation effects
    const plotContainerStyle = useMemo(
      () => ({
        width: '100%',
        height: '100%',
        transition: `all ${TRANSITION_DURATION.MEDIUM}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        filter: isAnimating || isLoading ? 'blur(6px)' : 'blur(0px)',
        opacity: isAnimating || isLoading ? 0.6 : 1,
        transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
      }),
      [isAnimating, isLoading]
    );

    // Only show error display if error and not loading
    if (error && !isLoading) {
      return <ErrorDisplay message={error} />;
    }

    // Only show empty state if no data and not loading
    if (!data && !isLoading) {
      return <EmptyState />;
    }

    // Render the heatmap with blur effect when loading
    return (
      <div className={containerClassName}>
        {/* Enhanced background effect for animation/loading */}
        {(isAnimating || isLoading) && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent z-0 animate-pulse"></div>
        )}

        {/* Plot area with animation */}
        <div
          className={`relative z-1 transition-all duration-500 ${isAnimating ? 'translate-y-1' : ''}`}
        >
          {data ? (
            <Plot
              data={plotData}
              layout={layout}
              config={plotConfig}
              style={plotContainerStyle}
            />
          ) : isLoading ? (
            <div
              className="w-full bg-gray-50"
              style={{ height: PLOT_HEIGHT }}
            ></div>
          ) : null}
        </div>
      </div>
    );
  }
);

HeatmapDisplay.displayName = DISPLAY_NAMES.HEATMAP_DISPLAY;

export default HeatmapDisplay;
