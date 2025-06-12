import React from 'react';
import { getAdditionalMetricsConfig } from '../utils/configUtils';

interface MetricsPopupProps {
  x: number;
  y: number;
  values: number[];
  labels: string[];
  folderName: string;
  onClose: () => void;
}

const MetricsPopup: React.FC<MetricsPopupProps> = ({
  x,
  y,
  values,
  labels,
  folderName,
  onClose,
}) => {
  const config = getAdditionalMetricsConfig(folderName);
  const maxValue = config.maxValue;

  console.log('MetricsPopup rendering with props:', { x, y, values, labels, folderName, config });

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg p-4 z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Additional Metrics</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => {
          const percentage = (value / maxValue) * 100;
          const color = config.colors[index] || '#1f77b4';
          
          console.log('Rendering metric:', { value, index, percentage, color, label: labels[index] });
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 w-24">{labels[index]}</span>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="text-xs text-gray-700 w-12 text-right">
                {value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsPopup; 