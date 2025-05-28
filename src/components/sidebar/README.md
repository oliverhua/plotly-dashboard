# Sidebar Module

This directory contains the modularized sidebar components for the heatmap visualization dashboard.

## Structure

```
sidebar/
├── README.md              # This documentation
├── index.ts               # Main exports
├── types.ts               # TypeScript interfaces and types
├── icons.tsx              # Centralized icon components
├── Sidebar.tsx            # Main sidebar container component
├── SidebarContent.tsx     # Content area with folder navigation
├── SidebarFooter.tsx      # Footer section
├── FolderItem.tsx         # Individual folder component
└── FileItem.tsx           # Individual file component
```

## Components

### Main Components

- **`Sidebar`**: The main container component that orchestrates all sub-components
- **`SidebarContent`**: Handles the scrollable content area with folder/file navigation
- **`SidebarFooter`**: Static footer with branding information

### Sub-Components

- **`FolderItem`**: Renders individual folders with expand/collapse functionality
- **`FileItem`**: Renders individual files with selection and navigation

### Utilities

- **`icons.tsx`**: Centralized SVG icon components for consistency
- **`types.ts`**: TypeScript interfaces for all components
- **`index.ts`**: Barrel exports for easy importing

## Usage

```tsx
import Sidebar from './components/sidebar/Sidebar';
// or
import { Sidebar, FileItem, FolderItem } from './components/sidebar';

// Use in component
<Sidebar
  folderStructure={folderStructure}
  selectedFolder={selectedFolder}
  selectedFile={selectedFile}
/>
```

## Benefits of Modularization

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Testing**: Easier to unit test individual components
4. **Performance**: Better tree-shaking and code splitting
5. **Developer Experience**: Clearer code organization and easier navigation
6. **Type Safety**: Centralized type definitions prevent inconsistencies

## Animation Integration

The sidebar components integrate with the `AnimationContext` to provide smooth transitions:

- File selections trigger loading animations
- Folder clicks don't trigger animations (as requested)
- Visual feedback during data loading states
