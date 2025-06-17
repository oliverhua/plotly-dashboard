import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import type { Config, Layout } from 'plotly.js';
import { getBarChartAxisLabels, getAdditionalMetricsConfig, formatDisplayName } from '../utils/configUtils';

interface BarChartTask {
  task: string;
  start: number;
  duration: number;
  resource: string;
  metrics: {
    [key: string]: {
      value: number;
      label: string;
    };
  };
}

interface BarChartData {
  tasks: BarChartTask[];
  metadata: {
    folder: string;
    generatedAt: string;
    totalTasks: number;
  };
}

interface BarChartProps {
  data: BarChartData | null;
  isLoading: boolean;
  error: string | null;
  selectedFolder: string;
  selectedTestcase: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  isLoading,
  error,
  selectedFolder,
  selectedTestcase,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 bg-transparent text-blue-600 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div className="text-lg font-medium text-blue-600 mb-2">Loading Report</div>
          <div className="text-gray-600">Please wait while we load the report data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-lg font-medium text-red-600 mb-2">Error Loading Report</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || !data.tasks || data.tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-lg font-medium text-blue-600 mb-2">No Report Data Available</div>
          <div className="text-gray-600">No test items found for the selected testcase.</div>
        </div>
      </div>
    );
  }

  // Get metrics configuration from plotly_config.json
  const metricsConfig = getAdditionalMetricsConfig(selectedFolder);
  const metricLabels = metricsConfig.labels;
  const metricColors = metricsConfig.colors;

  // Prepare stacked bar chart data
  const plotData = useMemo(() => {
    if (!data || !data.tasks) return [];

    // 過濾出當前 testcase 的資料
    const filteredTasks = data.tasks.filter(task => task.resource === selectedTestcase);
    
    if (filteredTasks.length === 0) return [];

    // 獲取所有指標的標籤（使用 plotly_config.json 中的設定）
    const metricKeys = Object.keys(filteredTasks[0].metrics);
    
    const traces: any[] = [];
    
    // 為每個指標創建一個 trace
    metricKeys.forEach((metricKey, index) => {
      const values = filteredTasks.map(task => task.metrics[metricKey]?.value || 0);
      const label = metricLabels[index] || `Metric ${index + 1}`;
      
      traces.push({
        x: filteredTasks.map(task => formatDisplayName(task.task)),
        y: values,
        name: label,
        type: 'bar',
        marker: {
          color: metricColors[index % metricColors.length],
          opacity: 0.8,
        },
        text: values.map(val => val.toFixed(1)),
        textposition: 'inside',
        textfont: {
          color: 'white',
          size: 10,
        },
        hovertemplate: 
          '<b>%{fullData.name}</b><br>' +
          'Test Item: %{x}<br>' +
          'Value: %{y:.1f}<br>' +
          '<extra></extra>',
      });
    });

    return traces;
  }, [data, selectedTestcase, metricLabels, metricColors]);

  // Layout configuration
  const layout: Partial<Layout> = useMemo(() => {
    // Get axis labels from config
    const axisLabels = getBarChartAxisLabels();
    
    return {
      title: {
        text: `Test Items Report - ${formatDisplayName(selectedFolder)} / ${formatDisplayName(selectedTestcase)}`,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 18,
          color: '#1f2937',
        },
      },
      xaxis: {
        title: {
          text: axisLabels.xAxisTitle,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            color: '#374151',
          },
        },
        showgrid: true,
        gridcolor: '#e5e7eb',
      },
      yaxis: {
        title: {
          text: axisLabels.yAxisTitle,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            color: '#374151',
          },
        },
        showgrid: true,
        gridcolor: '#e5e7eb',
      },
      barmode: 'stack',
      bargap: 0.2,
      margin: {
        l: 80,
        r: 50,
        b: 100,
        t: 80,
        pad: 10,
      },
      font: {
        family: 'Inter, system-ui, sans-serif',
        size: 12,
        color: '#374151',
      },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff',
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'right',
        x: 1,
      },
      hovermode: 'closest',
    };
  }, [selectedFolder, selectedTestcase]);

  // Plot configuration
  const config: Partial<Config> = useMemo(() => ({
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'pan2d',
      'select2d',
      'lasso2d',
      'resetScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines',
    ],
    displaylogo: false,
  }), []);

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Test Items Report
        </h3>
        <p className="text-sm text-gray-600">
          Metrics report for {formatDisplayName(selectedTestcase)} in {formatDisplayName(selectedFolder)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Each bar represents one heatmap with stacked average values of {metricLabels.length} metrics
        </p>
      </div>

      {/* Stacked Bar Chart */}
      <div className="w-full" style={{ height: '600px' }}>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Divider */}
      <div className="mt-6 mb-6 border-t border-gray-200"></div>

      {/* Metrics Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Metrics Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data && data.tasks.filter(task => task.resource === selectedTestcase).slice(0, 3).map((task) => (
            <div key={task.task} className="bg-white p-3 rounded border">
              <h5 className="font-medium text-gray-700 mb-2">{formatDisplayName(task.task)}</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Z-Value Avg:</span>
                  <span className="font-medium">{task.duration.toFixed(1)}</span>
                </div>
                {Object.entries(task.metrics).map(([key, metric], index) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{metricLabels[index] || metric.label}:</span>
                    <span className="font-medium">{metric.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Statistics */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-700 mb-2">Overall Statistics for {formatDisplayName(selectedTestcase)}</h5>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            {data && data.tasks.length > 0 && (() => {
              const filteredTasks = data.tasks.filter(task => task.resource === selectedTestcase);
              if (filteredTasks.length === 0) return null;
              
              return Object.entries(filteredTasks[0].metrics).map(([key, metric], index) => {
                const allValues = filteredTasks.map(task => task.metrics[key]?.value || 0);
                const avg = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
                const max = Math.max(...allValues);
                const min = Math.min(...allValues);
                
                return (
                  <div key={key} className="bg-white p-2 rounded border">
                    <div className="font-medium text-gray-700 text-xs mb-1">{metricLabels[index] || metric.label}</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Avg:</span>
                        <span className="font-medium">{avg.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Range:</span>
                        <span className="font-medium">{min.toFixed(1)}-{max.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart; 