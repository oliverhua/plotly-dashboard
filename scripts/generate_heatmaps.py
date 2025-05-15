import os
import json
import numpy as np
import random

# Create directories for data
os.makedirs('public/data/DVFS_Latency', exist_ok=True)
os.makedirs('public/data/Power_On_Latency', exist_ok=True)

# Function to generate random heatmap data
def generate_heatmap_data(rows=10, cols=10):
    # Generate random data
    z = np.random.rand(rows, cols)
    
    # Generate x and y labels
    x = [f"X{i}" for i in range(cols)]
    y = [f"Y{i}" for i in range(rows)]
    
    return {
        "z": z.tolist(),
        "x": x,
        "y": y
    }

# Generate DVFS Latency heatmaps
for i in range(5):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15)
    )
    
    filename = f"dvfs_sample_{i+1}.json"
    with open(f"public/data/DVFS_Latency/{filename}", "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated {filename}")

# Generate Power On Latency heatmaps
for i in range(20):
    data = generate_heatmap_data(
        rows=random.randint(8, 15),
        cols=random.randint(8, 15)
    )
    
    filename = f"power_on_sample_{i+1}.json"
    with open(f"public/data/Power_On_Latency/{filename}", "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated {filename}")

print("All heatmap data generated successfully!") 