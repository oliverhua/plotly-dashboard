# Plotly Heatmap Dashboard

This is a Vite + React application that displays Plotly heatmaps based on user selections.

## Features

- Interactive sidebar with dropdown menus for folder and file selection
- Dynamic Plotly heatmap display based on selected data
- Responsive layout using Tailwind CSS

## Project Structure

```
├── public/
│   └── data/
│       ├── DVFS_Latency/      # Contains DVFS latency heatmap data
│       └── Power_On_Latency/  # Contains Power On latency heatmap data
├── scripts/
│   └── generate_heatmaps.py   # Python script to generate sample heatmap data
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx        # Sidebar component with dropdown selections
│   │   └── HeatmapDisplay.tsx # Component to display Plotly heatmaps
│   ├── hooks/
│   │   └── useHeatmapData.ts  # Custom hook for managing heatmap data
│   ├── utils/
│   │   └── dataUtils.ts       # Utility functions for data handling
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Entry point
└── ...
```

## Getting Started

### Prerequisites

- Node.js
- Yarn
- Python (for generating sample data)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
3. Generate sample data (requires Python with numpy):
   ```
   python scripts/generate_heatmaps.py
   ```
4. Start the development server:
   ```
   yarn dev
   ```

## Usage

1. Select a folder from the first dropdown (e.g., "DVFS Latency" or "Power On Latency")
2. Select a file from the second dropdown
3. The corresponding heatmap will be displayed in the main area

## Technologies Used

- Vite
- React
- TypeScript
- Tailwind CSS
- Plotly.js
- Python (for data generation)
