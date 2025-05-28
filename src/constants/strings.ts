// UI Text Constants for better maintainability
export const UI_STRINGS = {
  // App Header
  APP_TITLE: 'Heatmap Data Visualization',
  APP_SUBTITLE: 'Made with ❤️ by Oliver(oliverhua)',

  // Main Content
  DEFAULT_CONTENT_TITLE: 'Heatmap Visualization',
  INTERACTIVE_DESCRIPTION: 'Interactive heatmap visualization',
  SELECT_INSTRUCTION:
    'Select a folder and file from the sidebar to view heatmap data',

  // Loading States
  LOADING_TITLE: 'Loading Data',
  LOADING_MESSAGE: 'Please wait while we fetch the heatmap data...',

  // Error States
  ERROR_TITLE: 'Error Loading Data',
  SOMETHING_WRONG: 'Something went wrong',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  TRY_AGAIN: 'Try again',

  // Empty States
  NO_DATA_TITLE: 'No Data Selected',
  NO_DATA_MESSAGE:
    'Please select a folder and file from the sidebar to view a heatmap.',

  // Sidebar
  SIDEBAR_TITLE: 'Heatmap Visualization',
  SIDEBAR_SUBTITLE: 'Interactive Data Explorer',

  // Component Display Names
  DISPLAY_NAMES: {
    STATUS_DISPLAY: 'StatusDisplay',
    LOADING_INDICATOR: 'LoadingIndicator',
    ERROR_DISPLAY: 'ErrorDisplay',
    EMPTY_STATE: 'EmptyState',
    HEATMAP_DISPLAY: 'HeatmapDisplay',
    SIDEBAR_FOOTER: 'SidebarFooter',
    FOLDER_ITEM: 'FolderItem',
    FILE_ITEM: 'FileItem',
  },

  // Plotly Configuration
  PLOTLY: {
    MODE_BAR_BUTTONS_TO_REMOVE: ['lasso2d', 'select2d'] as const,
    HEATMAP_TYPE: 'heatmap' as const,
  },

  // CSS Classes - commonly used class combinations
  CSS_CLASSES: {
    // Loading and animation states
    LOADING_SPINNER:
      'w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin',

    // Status display containers
    STATUS_CONTAINER: 'flex items-center justify-center min-h-[400px] p-8',
    STATUS_CONTENT: 'flex flex-col items-center text-center max-w-md',
    STATUS_ICON: 'w-16 h-16 rounded-full flex items-center justify-center mb-4',
    STATUS_TITLE: 'text-lg font-medium mb-2',
    STATUS_MESSAGE: 'text-gray-600',

    // Icon styles
    ICON_SIZE: 'w-8 h-8',

    // Color schemes
    COLORS: {
      BLUE: {
        BACKGROUND: 'bg-blue-100',
        TEXT: 'text-blue-500',
        BORDER: 'border-blue-100',
        SELECTED: 'bg-blue-100 text-blue-700',
      },
      RED: {
        BACKGROUND: 'bg-red-100',
        TEXT: 'text-red-600',
        BUTTON: 'bg-red-600 text-white',
        BUTTON_HOVER: 'hover:bg-red-700',
      },
      GRAY: {
        BACKGROUND: 'bg-gray-50',
        TEXT: 'text-gray-600',
        BORDER: 'border-gray-100',
        HOVER: 'hover:bg-gray-100 hover:text-gray-700',
      },
    },

    // Transitions
    TRANSITIONS: {
      DEFAULT: 'transition-all duration-300',
      COLORS: 'transition-colors duration-300',
      MEDIUM: 'transition-all duration-500',
      BUTTON: 'transition-colors duration-200',
    },

    // Layout
    LAYOUT: {
      FULL_SIZE: 'w-full h-full',
      FLEX_CENTER: 'flex items-center justify-center',
      ROUNDED: 'rounded-lg',
      PADDING: 'p-4',
      SHADOW: 'shadow-sm',
    },
  },

  // SVG Paths for icons
  SVG_PATHS: {
    ERROR_ICON: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    INFO_ICON: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    WARNING_ICON:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  },

  // Accessibility and SEO
  ACCESSIBILITY: {
    STROKE_LINECAP: 'round' as const,
    STROKE_LINEJOIN: 'round' as const,
    STROKE_WIDTH: '2',
    FILL: 'none',
    STROKE: 'currentColor',
    VIEWBOX: '0 0 24 24',
    XMLNS: 'http://www.w3.org/2000/svg',
  },
} as const;

// Export individual sections for easier imports
export const {
  APP_TITLE,
  APP_SUBTITLE,
  DEFAULT_CONTENT_TITLE,
  INTERACTIVE_DESCRIPTION,
  SELECT_INSTRUCTION,
  LOADING_TITLE,
  LOADING_MESSAGE,
  ERROR_TITLE,
  SOMETHING_WRONG,
  UNEXPECTED_ERROR,
  TRY_AGAIN,
  NO_DATA_TITLE,
  NO_DATA_MESSAGE,
  SIDEBAR_TITLE,
  SIDEBAR_SUBTITLE,
  DISPLAY_NAMES,
  PLOTLY,
  CSS_CLASSES,
  SVG_PATHS,
  ACCESSIBILITY,
} = UI_STRINGS;
