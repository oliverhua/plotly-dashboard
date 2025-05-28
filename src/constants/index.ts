// Animation and timing constants
export const ANIMATION_DURATION = 500; // milliseconds
export const PLOT_HEIGHT = 550; // pixels

// UI constants
export const SIDEBAR_WIDTH = 256; // pixels (w-64 in Tailwind)
export const HEADER_HEIGHT = 80; // pixels

// File extensions
export const JSON_EXTENSION = '.json';

// CSS transition durations
export const TRANSITION_DURATION = {
  SHORT: 300,
  MEDIUM: 400,
  LONG: 500,
} as const;

// Plot configuration
export const PLOT_CONFIG = {
  COLORSCALE: 'Viridis',
  FONT_FAMILY: 'system-ui, -apple-system, sans-serif',
  TITLE_FONT_SIZE: 18,
  BODY_FONT_SIZE: 12,
  FONT_COLOR: '#333',
} as const;

// Layout margins
export const PLOT_MARGINS = {
  LEFT: 80,
  RIGHT: 50,
  BOTTOM: 80,
  TOP: 80,
  PAD: 0,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOAD_STRUCTURE: 'Failed to load data structure',
  LOAD_HEATMAP: 'Failed to load heatmap data',
  HTML_RESPONSE: 'Received HTML instead of JSON',
  HTTP_ERROR: (status: number) => `HTTP error! Status: ${status}`,
  HTML_CONTENT: (status: number) =>
    `Received HTML instead of JSON. Status: ${status}`,
} as const;

// Re-export UI strings for centralized access
export * from './strings';
