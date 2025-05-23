# Plotly Dashboard - Heatmap Visualization

A modern, optimized React application for visualizing heatmap data using Plotly.js with TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Interactive Heatmap Visualization**: Dynamic heatmap rendering with Plotly.js
- **File Explorer**: Sidebar navigation for browsing data folders and files
- **Smooth Animations**: Context-based animation system with visual feedback
- **Error Handling**: Comprehensive error boundaries and user-friendly error states
- **Performance Optimized**: Memoized components, request deduplication, and caching
- **Type Safe**: Full TypeScript support with strict type checking
- **Modern UI**: Tailwind CSS with responsive design and accessibility features

## 🏗️ Architecture & Optimizations

### Code Structure

```
src/
├── components/          # React components
│   ├── ErrorBoundary.tsx    # Error boundary for graceful error handling
│   ├── HeatmapDisplay.tsx   # Main heatmap visualization component
│   └── Sidebar.tsx          # Navigation sidebar component
├── contexts/           # React contexts
│   └── AnimationContext.tsx # Animation state management
├── hooks/              # Custom React hooks
│   ├── useHeatmapData.ts    # Data fetching and state management
│   └── usePerformanceMonitor.ts # Performance monitoring (dev only)
├── utils/              # Utility functions
│   ├── dataUtils.ts         # Data fetching utilities
│   ├── helpers.ts           # Common helper functions
│   ├── requestManager.ts    # Request caching and deduplication
│   └── folderStructure.ts   # Auto-generated folder structure
└── constants/          # Application constants
    └── index.ts             # Centralized configuration
```

### Performance Optimizations

1. **Request Management**

   - Global singleton request manager
   - Request deduplication and caching
   - Automatic request cancellation
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

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
   yarn install
```

### Development Server

```bash
   yarn dev
```

### Build for Production

```bash
yarn build
```

### Linting

```bash
yarn lint
```

### Preview Production Build

```bash
yarn preview
```

## 📁 Data Structure

The application expects data files in the following structure:

```
public/data/
├── folder1/
│   ├── sample1.json
│   ├── sample2.json
│   └── ...
├── folder2/
│   ├── sample1.json
│   └── ...
└── ...
```

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

All application constants are centralized in `src/constants/index.ts`:

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

## 📄 License

This project is licensed under the MIT License.
