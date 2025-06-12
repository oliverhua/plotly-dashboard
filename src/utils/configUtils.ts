import configData from '../config/plotly_config.json';

export interface PlotlyConfig {
  displayNames: {
    folders: Record<string, string>;
    testcases: Record<string, string>;
    files: Record<string, string>;
  };
  chartSettings: {
    axisLabels: {
      xAxisTitle: string;
      yAxisTitle: string;
    };
    titles: {
      defaultPrefix: string;
      defaultSuffix: string;
    };
    zAxisRanges: {
      [folderName: string]: {
        zmin: number;
        zmax: number;
      };
      default: {
        zmin: number;
        zmax: number;
      };
    };
    additionalMetrics: {
      [folderName: string]: {
        enabled: boolean;
        labels: Record<string, string>;
        colors: Record<string, string>;
        maxValue: number;
      };
      default: {
        enabled: boolean;
        labels: Record<string, string>;
        colors: Record<string, string>;
        maxValue: number;
      };
    };
  };
  fallbackSettings: {
    removeFileExtension: boolean;
    replaceUnderscoreWithSpace: boolean;
    capitalizeFirstLetter: boolean;
  };
}

/**
 * Get the configuration data
 */
export const getPlotlyConfig = (): PlotlyConfig => {
  return configData as PlotlyConfig;
};

/**
 * Get display name for a folder
 */
export const getFolderDisplayName = (folderName: string): string => {
  const config = getPlotlyConfig();
  return (
    config.displayNames.folders[folderName] ||
    formatFallbackName(folderName, config.fallbackSettings)
  );
};

/**
 * Get display name for a testcase
 */
export const getTestcaseDisplayName = (testcaseName: string): string => {
  const config = getPlotlyConfig();
  return (
    config.displayNames.testcases[testcaseName] ||
    formatFallbackName(testcaseName, config.fallbackSettings)
  );
};

/**
 * Get display name for a file
 */
export const getFileDisplayName = (fileName: string): string => {
  const config = getPlotlyConfig();
  return (
    config.displayNames.files[fileName] ||
    formatFallbackName(fileName, config.fallbackSettings)
  );
};

/**
 * Get chart title for a file
 */
export const getChartTitle = (fileName: string): string => {
  const config = getPlotlyConfig();
  const displayName = getFileDisplayName(fileName);
  return `${config.chartSettings.titles.defaultPrefix}${displayName}${config.chartSettings.titles.defaultSuffix}`;
};

/**
 * Get axis labels from config
 */
export const getAxisLabels = () => {
  const config = getPlotlyConfig();
  return config.chartSettings.axisLabels;
};

/**
 * Get Z-axis range for a specific folder
 */
export const getZAxisRange = (
  folderName: string
): { zmin: number; zmax: number } => {
  const config = getPlotlyConfig();
  return (
    config.chartSettings.zAxisRanges[folderName] ||
    config.chartSettings.zAxisRanges.default
  );
};

/**
 * Get additional metrics configuration for a folder
 */
export const getAdditionalMetricsConfig = (folderName: string) => {
  const config = configData as PlotlyConfig;
  return (
    config.chartSettings.additionalMetrics[folderName] ||
    config.chartSettings.additionalMetrics.default
  );
};

/**
 * Format name using fallback settings
 */
const formatFallbackName = (
  name: string,
  fallbackSettings: PlotlyConfig['fallbackSettings']
): string => {
  let formatted = name;

  // Remove file extension if enabled
  if (fallbackSettings.removeFileExtension) {
    formatted = formatted.replace(/\.[^/.]+$/, '');
  }

  // Replace underscores with spaces if enabled
  if (fallbackSettings.replaceUnderscoreWithSpace) {
    formatted = formatted.replace(/_/g, ' ');
  }

  // Capitalize first letter if enabled
  if (fallbackSettings.capitalizeFirstLetter) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted;
};
