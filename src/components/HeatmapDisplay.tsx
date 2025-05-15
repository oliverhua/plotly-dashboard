import React, { useContext, useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import type { HeatmapData } from "../utils/dataUtils";
import type { Layout, Config } from "plotly.js";
import { AnimationContext } from "./Sidebar";

interface HeatmapDisplayProps {
    data: HeatmapData | null;
    isLoading: boolean;
    error: string | null;
    selectedFile: string;
}

// 提取狀態顯示組件以減少重複代碼
const StatusDisplay = ({
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
);

const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({
    data,
    isLoading,
    error,
    selectedFile,
}) => {
    // 1. 首先調用所有 Hook，保持一致的順序
    const { isAnimating } = useContext(AnimationContext);
    const [displayData, setDisplayData] = useState<HeatmapData | null>(data);

    // 2. useEffect
    useEffect(() => {
        if (data !== displayData) {
            if (isAnimating) {
                const timer = setTimeout(() => {
                    setDisplayData(data);
                }, 300);
                return () => clearTimeout(timer);
            } else {
                setDisplayData(data);
            }
        }
    }, [data, displayData, isAnimating]);

    // 3. 佈局配置 useMemo
    const layout: Partial<Layout> = useMemo(
        () => ({
            title: {
                text: selectedFile.replace(".json", ""),
                font: {
                    family: "system-ui, -apple-system, sans-serif",
                    size: 18,
                },
            },
            autosize: true,
            margin: {
                l: 80,
                r: 50,
                b: 80,
                t: 80,
                pad: 0,
            },
            height: 550,
            font: {
                family: "system-ui, -apple-system, sans-serif",
                size: 12,
                color: "#333",
            },
        }),
        [selectedFile]
    );

    // 4. Plotly 配置 useMemo
    const plotConfig: Partial<Config> = useMemo(
        () => ({
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["lasso2d", "select2d"],
            displaylogo: false,
        }),
        []
    );

    // 5. 容器類名 useMemo
    const containerClassName = useMemo(
        () =>
            isAnimating
                ? "w-full h-full p-4 transition-all duration-500 bg-gray-50 rounded-lg opacity-90 relative"
                : "w-full h-full p-4 transition-all duration-500 bg-white rounded-lg relative",
        [isAnimating]
    );

    // 6. Plotly 數據 useMemo - 必須確保它在每次渲染時都被調用
    const plotData = useMemo(() => {
        // 只有在有數據時才生成有效的熱圖數據
        if (displayData) {
            return [
                {
                    z: displayData.z,
                    x: displayData.x,
                    y: displayData.y,
                    type: "heatmap" as const,
                    colorscale: "Viridis",
                    showscale: true,
                },
            ];
        }
        // 返回空數據作為後備方案
        return [];
    }, [displayData]);

    // Plot容器樣式添加過渡效果
    const plotContainerStyle = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            transition: "all 500ms ease-in-out",
            filter: isAnimating ? "blur(6px)" : "blur(0px)",
            opacity: isAnimating ? 0.6 : 1,
        }),
        [isAnimating]
    );

    // 處理不同狀態
    if (isLoading) {
        return (
            <StatusDisplay
                icon={
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                }
                title="Loading Data"
                message="Please wait while we fetch the heatmap data..."
                bgColor="bg-transparent"
                textColor="text-blue-500"
            />
        );
    }

    if (error) {
        return (
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
                message={error}
                bgColor="bg-red-100"
                textColor="text-red-600"
            />
        );
    }

    if (!displayData) {
        return (
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
        );
    }

    return (
        <div className={containerClassName}>
            {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-transparent z-0 animate-pulse"></div>
            )}
            <div className="relative z-1">
                <Plot
                    data={plotData}
                    layout={layout}
                    config={plotConfig}
                    style={plotContainerStyle}
                />
            </div>
        </div>
    );
};

export default React.memo(HeatmapDisplay);
