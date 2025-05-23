import React, { useContext, useMemo, useRef } from "react";
import Plot from "react-plotly.js";
import type { HeatmapData } from "../utils/dataUtils";
import type { Layout, Config } from "plotly.js";
import { AnimationContext } from "../contexts/AnimationContext";
import { 
  PLOT_HEIGHT, 
  PLOT_CONFIG, 
  PLOT_MARGINS, 
  JSON_EXTENSION,
  TRANSITION_DURATION 
} from "../constants";

interface HeatmapDisplayProps {
    data: HeatmapData | null;
    isLoading: boolean;
    error: string | null;
    selectedFile: string;
}

// 提取狀態顯示組件以減少重複代碼
const StatusDisplay = React.memo(({
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
            <div className={`text-lg font-medium ${textColor} mb-2`}>
                {title}
            </div>
            <div className="text-gray-600">{message}</div>
        </div>
    </div>
));

StatusDisplay.displayName = 'StatusDisplay';

// Loading indicator
const LoadingIndicator = React.memo(() => (
    <StatusDisplay
        icon={
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        }
        title="Loading Data"
        message="Please wait while we fetch the heatmap data..."
        bgColor="bg-transparent"
        textColor="text-blue-500"
    />
));

LoadingIndicator.displayName = 'LoadingIndicator';

// Error display
const ErrorDisplay = React.memo(({ message }: { message: string }) => (
    <StatusDisplay
        icon={
            <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
        }
        title="Error Loading Data"
        message={message}
        bgColor="bg-red-100"
        textColor="text-red-600"
    />
));

ErrorDisplay.displayName = 'ErrorDisplay';

// Empty state
const EmptyState = React.memo(() => (
    <StatusDisplay
        icon={
            <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
        }
        title="No Data Selected"
        message="Please select a folder and file from the sidebar to view a heatmap."
        bgColor="bg-blue-100"
        textColor="text-blue-500"
    />
));

EmptyState.displayName = 'EmptyState';

// The main heatmap display component
const HeatmapDisplay: React.FC<HeatmapDisplayProps> = React.memo(({
    data,
    isLoading,
    error,
    selectedFile,
}) => {
    const { isAnimating } = useContext(AnimationContext);
    const renderCount = useRef(0);
    
    // Log render count in development
    if (import.meta.env.DEV) {
        renderCount.current++;
        console.log(`HeatmapDisplay render #${renderCount.current}`, {
            hasData: !!data,
            dataSize: data ? `${data.z.length}x${data.z[0]?.length}` : 0,
            isLoading,
            error,
            selectedFile,
        });
    }

    // Layout configuration
    const layout: Partial<Layout> = useMemo(() => ({
        title: {
            text: selectedFile.replace(JSON_EXTENSION, ""),
            font: { family: PLOT_CONFIG.FONT_FAMILY, size: PLOT_CONFIG.TITLE_FONT_SIZE },
        },
        autosize: true,
        margin: { 
          l: PLOT_MARGINS.LEFT, 
          r: PLOT_MARGINS.RIGHT, 
          b: PLOT_MARGINS.BOTTOM, 
          t: PLOT_MARGINS.TOP, 
          pad: PLOT_MARGINS.PAD 
        },
        height: PLOT_HEIGHT,
        font: {
            family: PLOT_CONFIG.FONT_FAMILY,
            size: PLOT_CONFIG.BODY_FONT_SIZE,
            color: PLOT_CONFIG.FONT_COLOR,
        },
    }), [selectedFile]);

    // Plotly configuration
    const plotConfig: Partial<Config> = useMemo(() => ({
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ["lasso2d", "select2d"],
        displaylogo: false,
    }), []);

    // Container class name - add blur when loading
    const containerClassName = useMemo(() => {
        let className = "w-full h-full p-4 transition-all duration-500 rounded-lg relative ";
        
        if (isAnimating || isLoading) {
            className += "bg-gray-50 opacity-90 ";
        } else {
            className += "bg-white ";
        }
        
        return className;
    }, [isAnimating, isLoading]);

    // Heatmap data
    const plotData = useMemo(() => {
        if (!data) return [];
        
        return [{
            z: data.z,
            x: data.x,
            y: data.y,
            type: "heatmap" as const,
            colorscale: PLOT_CONFIG.COLORSCALE,
            showscale: true,
        }];
    }, [data]);

    // Plot container style - enhanced animation effects
    const plotContainerStyle = useMemo(() => ({
        width: "100%",
        height: "100%",
        transition: `all ${TRANSITION_DURATION.MEDIUM}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        filter: isAnimating || isLoading ? "blur(6px)" : "blur(0px)",
        opacity: isAnimating || isLoading ? 0.6 : 1,
        transform: isAnimating ? "scale(0.98)" : "scale(1)",
    }), [isAnimating, isLoading]);

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
            <div className={`relative z-1 transition-all duration-500 ${isAnimating ? 'translate-y-1' : ''}`}>
                {data ? (
                    <Plot
                        data={plotData}
                        layout={layout}
                        config={plotConfig}
                        style={plotContainerStyle}
                    />
                ) : isLoading ? (
                    <div className="w-full bg-gray-50" style={{ height: PLOT_HEIGHT }}></div>
                ) : null}
            </div>
        </div>
    );
});

HeatmapDisplay.displayName = 'HeatmapDisplay';

export default HeatmapDisplay;
