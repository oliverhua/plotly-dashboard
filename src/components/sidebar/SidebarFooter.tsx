import React from 'react';

import { ChartIcon } from './icons';

const SidebarFooter: React.FC = React.memo(() => (
  <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
    <a
      href="#"
      className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 transition-colors duration-300"
      onClick={e => e.preventDefault()}
    >
      <div className="size-10 rounded-full bg-gray-100 grid place-content-center text-gray-600">
        <ChartIcon />
      </div>

      <div>
        <p className="text-xs">
          <strong className="block font-medium">Heatmap Visualization</strong>
          <span>Interactive Data Explorer</span>
        </p>
      </div>
    </a>
  </div>
));

SidebarFooter.displayName = 'SidebarFooter';

export default SidebarFooter;
