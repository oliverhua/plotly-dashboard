# Plotly Dashboard - Heatmap Visualization

A modern, optimized React application for visualizing heatmap data using Plotly.js with TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Interactive Heatmap Visualization**: Dynamic heatmap rendering with Plotly.js
- **Hierarchical Data Structure**: Organized by folders and testcases for better data management
- **Multiple Heatmaps per Testcase**: Display all heatmaps from a testcase on a single page
- **File Explorer**: Sidebar navigation for browsing data folders and testcases
- **Smooth Animations**: Context-based animation system with visual feedback
- **Error Handling**: Comprehensive error boundaries and user-friendly error states
- **Performance Optimized**: Memoized components, request deduplication, and caching
- **Type Safe**: Full TypeScript support with strict type checking
- **Modern UI**: Tailwind CSS with responsive design and accessibility features

## 📁 Data Structure (IMPORTANT!)

### New Hierarchical Structure

The application now uses a **hierarchical data structure** with testcases:

```
public/data/
├── DVFS_Latency/
│   ├── testcaseA/
│   │   ├── SSWRP1.json
│   │   ├── SSWRP2.json
│   │   └── SSWRP3.json
│   ├── testcaseB/
│   │   ├── SSWRP4.json
│   │   ├── SSWRP5.json
│   │   ├── SSWRP6.json
│   │   └── SSWRP7.json
│   └── testcaseC/
│       ├── SSWRP8.json
│       └── SSWRP9.json
└── Power_On_Latency/
    ├── testcaseA/
    │   ├── SSWRP1.json
    │   ├── SSWRP2.json
    │   └── SSWRP3.json
    └── testcaseB/
        ├── SSWRP4.json
        ├── SSWRP5.json
        ├── SSWRP6.json
        └── SSWRP7.json
```

### Key Changes from Previous Version

- **Testcase Organization**: Each folder now contains testcase subdirectories
- **Multiple Heatmaps**: Each testcase displays all its JSON files as separate heatmaps on one page
- **URL Structure**: Changed from `/:folder/:file` to `/:folder/:testcase`

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Python 3.x (for data generation)
- Yarn package manager

### Installation

```bash
yarn install
```

### **IMPORTANT: Data Generation & Setup**

After pulling the project or setting up on a new machine:

1. **Generate fake data and update folder structure**:

   ```bash
   yarn generate-data
   ```

   This will:

   - Generate fake heatmap data in the correct hierarchical structure
   - Automatically update `src/utils/folderStructure.ts` to match the actual data structure

2. **Or run commands separately**:

   ```bash
   # Generate fake data
   python scripts/generate_heatmaps.py

   # Update folder structure
   yarn update-structure
   ```

### Available Scripts

```bash
# Development server
yarn dev

# Generate fake data + update folder structure
yarn generate-data

# Update folder structure only (after manual data changes)
yarn update-structure

# Build for production (includes folder structure update)
yarn build

# Linting
yarn lint

# Formatting
yarn format

# Preview production build
yarn preview
```

### Development Server

```bash
yarn dev
```

### Build for Production

```bash
yarn build
```

## 📋 Setup Checklist for New Machines

1. ✅ Clone the repository
2. ✅ Run `npm install`
3. ✅ **Run `yarn generate-data`** (CRITICAL - generates data and updates folder structure)
4. ✅ Run `yarn dev`
5. ✅ Verify the sidebar shows the hierarchical structure with testcases

## 🏗️ Architecture & Optimizations

### Code Structure

```
src/
├── components/          # React components
│   ├── ErrorBoundary.tsx    # Error boundary for graceful error handling
│   ├── HeatmapDisplay.tsx   # Main heatmap visualization component (supports multiple heatmaps)
│   └── sidebar/             # Sidebar components
│       ├── Sidebar.tsx          # Main sidebar component
│       ├── FolderItem.tsx       # Folder navigation item
│       ├── TestcaseItem.tsx     # Testcase navigation item (NEW)
│       └── types.ts             # Sidebar type definitions
├── contexts/           # React contexts
│   └── AnimationContext.tsx # Animation state management
├── hooks/              # Custom React hooks
│   ├── useHeatmapData.ts    # Data fetching and state management (updated for testcases)
│   └── usePerformanceMonitor.ts # Performance monitoring (dev only)
├── utils/              # Utility functions
│   ├── dataUtils.ts         # Data fetching utilities (supports testcase data)
│   ├── helpers.ts           # Common helper functions
│   ├── requestManager.ts    # Request caching and deduplication (supports concurrent requests)
│   └── folderStructure.ts   # Auto-generated folder structure (HIERARCHICAL)
├── constants/          # Application constants
│   └── strings.ts           # Centralized configuration
└── scripts/            # Build and data generation scripts
    ├── generate_heatmaps.py        # Generates fake heatmap data
    └── generate_folder_structure.js # Updates folderStructure.ts
```

### Performance Optimizations

1. **Request Management**

   - Global singleton request manager
   - **Concurrent request support** (fixed from previous version)
   - Request deduplication and caching
   - Automatic request cancellation for navigation
   - Error handling with retry logic

2. **React Optimizations**

   - Memoized components with `React.memo`
   - Optimized context usage to prevent unnecessary re-renders
   - Proper dependency arrays in hooks
   - Lazy loading and code splitting

3. **Build Optimizations**

   - Vite configuration with chunk splitting
   - Vendor chunk separation for better caching
   - Optimized dependency pre-bundling
   - Tree shaking for smaller bundle sizes

4. **Type Safety**
   - Strict TypeScript configuration
   - Proper type definitions for all components
   - Type-safe error handling
   - No `any` types allowed

### Code Quality Features

- **ESLint Configuration**: Strict linting rules with React hooks and TypeScript support
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks
- **Performance Monitoring**: Development-time performance tracking
- **Consistent Styling**: Centralized constants for animations, colors, and spacing
- **Helper Functions**: Reusable utilities for common operations

## 📊 Data Format

Each JSON file should contain heatmap data in the format:

```json
{
  "z": [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  "x": ["A", "B", "C"],
  "y": ["X", "Y", "Z"]
}
```

## 🎨 Customization

### Constants

All application constants are centralized in `src/constants/strings.ts`:

- Animation durations
- Plot configuration
- UI dimensions
- Error messages

### Styling

The application uses Tailwind CSS with custom configurations. Modify `tailwind.config.js` for theme customization.

### Performance Monitoring

In development mode, the application includes performance monitoring that logs:

- Component render times
- Slow render warnings (>16ms)
- Request timing and caching statistics

## 🚀 Deployment

The application is configured for deployment to GitHub Pages with the base path `/plotly-dashboard/`. Update the `base` property in `vite.config.ts` for different deployment targets.

## ⚠️ Troubleshooting

### Common Issues

1. **Empty or incorrect sidebar structure**:

   - Run `yarn update-structure` to regenerate `folderStructure.ts`

2. **Data loading errors**:

   - Ensure data files exist in the correct hierarchical structure
   - Run `yarn generate-data` to create sample data

3. **TypeScript errors after pulling**:
   - Run `yarn update-structure` to update type definitions

### Debug Steps

1. Check if `public/data/` has the correct structure
2. Verify `src/utils/folderStructure.ts` matches the actual data structure
3. Run `yarn generate-data` to reset everything

## 📈 Performance Metrics

- **Bundle Size**: Optimized with vendor chunk splitting
- **First Contentful Paint**: Improved with pre-bundled dependencies
- **Time to Interactive**: Enhanced with request caching and memoization
- **Runtime Performance**: Monitored with custom performance hooks

## 🤝 Contributing

1. Follow the established code structure and patterns
2. Ensure all TypeScript types are properly defined
3. Add appropriate error handling for new features
4. Update tests and documentation as needed
5. Run linting before submitting changes
6. **Always run `yarn update-structure` after modifying data structure**

## 📄 License

This project is licensed under the MIT License.
