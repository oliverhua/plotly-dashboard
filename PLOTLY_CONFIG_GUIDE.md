# Plotly Dashboard Configuration Guide

## 📋 Configuration File Description

Edit `src/config/plotly_config.json` to customize the interface display:

```json
{
  "displayNames": {
    "folders": {
      "DVFS_Latency": "DVFS Latency Analysis",
      "Power_On_Latency": "Power On Latency Analysis"
    },
    "testcases": {
      "testcaseA": "Test Case A",
      "testcaseB": "Test Case B",
      "testcaseC": "Test Case C"
    },
    "files": {
      "SSWRP1.json": "Single System Write-Read Performance 1",
      "SSWRP2.json": "Single System Write-Read Performance 2",
      "SSWRP3.json": "Single System Write-Read Performance 3"
    }
  },
  "chartSettings": {
    "axisLabels": {
      "xAxisTitle": "From PF State",
      "yAxisTitle": "To PF State"
    },
    "titles": {
      "defaultPrefix": "",
      "defaultSuffix": " - Performance Heatmap"
    },
    "zAxisRanges": {
      "DVFS_Latency": {
        "zmin": 0,
        "zmax": 150
      },
      "Power_On_Latency": {
        "zmin": 0,
        "zmax": 300
      },
      "default": {
        "zmin": 0,
        "zmax": 200
      }
    }
  },
  "fallbackSettings": {
    "removeFileExtension": true,
    "replaceUnderscoreWithSpace": true,
    "capitalizeFirstLetter": true
  }
}
```

## 🎯 Configuration Explanation

### 1. Display Names (displayNames)

- **folders**: Folder display names
- **testcases**: Test case display names
- **files**: File display names

### 2. Chart Settings (chartSettings)

- **axisLabels**: X/Y axis titles
- **titles**: Chart title prefix/suffix
- **zAxisRanges**: Z-axis range for each folder (Important feature!)

### 3. Fallback Settings (fallbackSettings)

- **removeFileExtension**: Remove file extensions
- **replaceUnderscoreWithSpace**: Replace underscores with spaces
- **capitalizeFirstLetter**: Capitalize first letter

## 🚀 How to Use

1. **Edit Configuration**: Modify `src/config/plotly_config.json`
2. **Rebuild**: Run `yarn build`
3. **Start Service**: Run `yarn dev`

## ⭐ Z-Axis Range Configuration (Core Feature)

Different folders can have different color ranges:

```json
"zAxisRanges": {
  "DVFS_Latency": { "zmin": 0, "zmax": 150 },
  "Power_On_Latency": { "zmin": 0, "zmax": 300 },
  "default": { "zmin": 0, "zmax": 200 }
}
```

- **DVFS_Latency**: 0-150 range, suitable for fine latency data
- **Power_On_Latency**: 0-300 range, suitable for power-related data
- **default**: 0-200 range, general default value

## ⚠️ Important Notes

1. **JSON Format**: Ensure the configuration file is in valid JSON format
2. **Rebuild Required**: Need to run `yarn build` after modifying configuration
3. **Case Sensitive**: Key names in configuration are case-sensitive

That's it! Modify the configuration file, rebuild, and you'll see the changes!
