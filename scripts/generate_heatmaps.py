import os
import json
import numpy as np
import random

# Create directories for data with new structure
def create_directories():
    # DVFS_Latency structure
    os.makedirs('public/data/DVFS_Latency/testcaseA', exist_ok=True)
    os.makedirs('public/data/DVFS_Latency/testcaseB', exist_ok=True)
    os.makedirs('public/data/DVFS_Latency/testcaseC', exist_ok=True)
    
    # Power_On_Latency structure
    os.makedirs('public/data/Power_On_Latency/testcaseA', exist_ok=True)
    os.makedirs('public/data/Power_On_Latency/testcaseB', exist_ok=True)

# Function to generate random heatmap data
def generate_heatmap_data(rows=10, cols=10, has_additional_metrics=False):
    # Generate random data in range 0-500
    z = np.random.rand(rows, cols) * 500
    
    # Generate x and y labels starting from 1
    x = [f"X{i}" for i in range(1, cols + 1)]
    y = [f"Y{i}" for i in range(1, rows + 1)]
    
    result = {
        "z": z.tolist(),
        "x": x,
        "y": y
    }
    
    # Only generate additional metrics if specified
    if has_additional_metrics:
        # Generate additional metrics data
        # Each metric will have its own matrix of values
        additional_metrics = {
            "metric1": {
                "values": (np.random.rand(rows, cols) * 100).tolist(),  # CPU Usage
                "label": "CPU Usage"
            },
            "metric2": {
                "values": (np.random.rand(rows, cols) * 100).tolist(),  # Memory Usage
                "label": "Memory Usage"
            },
            "metric3": {
                "values": (np.random.rand(rows, cols) * 100).tolist(),  # Disk I/O
                "label": "Disk I/O"
            },
            "metric4": {
                "values": (np.random.rand(rows, cols) * 100).tolist(),  # Network I/O
                "label": "Network I/O"
            },
            "metric5": {
                "values": (np.random.rand(rows, cols) * 100).tolist(),  # Power Consumption
                "label": "Power Consumption"
            }
        }
        result["additionalMetrics"] = additional_metrics
    
    return result

# Create directory structure
create_directories()

# Generate DVFS Latency data
print("Generating DVFS_Latency data...")

# testcaseA: SSWRP1, SSWRP2, SSWRP3
for i in range(1, 4):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15),
        has_additional_metrics=True  # DVFS_Latency has additional metrics
    )
    filename = f"SSWRP{i}.json"
    filepath = f"public/data/DVFS_Latency/testcaseA/{filename}"
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath}")

# testcaseB: SSWRP4, SSWRP5, SSWRP6, SSWRP7
for i in range(4, 8):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15),
        has_additional_metrics=True  # DVFS_Latency has additional metrics
    )
    filename = f"SSWRP{i}.json"
    filepath = f"public/data/DVFS_Latency/testcaseB/{filename}"
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath}")

# testcaseC: SSWRP8, SSWRP9
for i in range(8, 10):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15),
        has_additional_metrics=True  # DVFS_Latency has additional metrics
    )
    filename = f"SSWRP{i}.json"
    filepath = f"public/data/DVFS_Latency/testcaseC/{filename}"
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath}")

# Generate Power_On_Latency data
print("Generating Power_On_Latency data...")

# testcaseA: SSWRP1, SSWRP2, SSWRP3
for i in range(1, 4):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15),
        has_additional_metrics=False  # Power_On_Latency doesn't have additional metrics
    )
    filename = f"SSWRP{i}.json"
    filepath = f"public/data/Power_On_Latency/testcaseA/{filename}"
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath}")

# testcaseB: SSWRP4, SSWRP5, SSWRP6, SSWRP7
for i in range(4, 8):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15),
        has_additional_metrics=False  # Power_On_Latency doesn't have additional metrics
    )
    filename = f"SSWRP{i}.json"
    filepath = f"public/data/Power_On_Latency/testcaseB/{filename}"
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath}")

print("All heatmap data generated successfully with new structure!") 