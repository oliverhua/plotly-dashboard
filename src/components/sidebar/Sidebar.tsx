import React, { useContext, useMemo } from 'react';

import { AnimationContext } from '../../contexts/AnimationContext';

import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import type { SidebarProps } from './types';

const Sidebar: React.FC<SidebarProps> = ({
  folderStructure,
  selectedFolder,
  selectedTestcase,
}) => {
  const { isAnimating } = useContext(AnimationContext);

  const containerClassName = useMemo(
    () =>
      `flex h-full flex-col justify-between border-e bg-white transition-all duration-300 ${
        isAnimating ? 'shadow-lg border-blue-100' : 'border-gray-100'
      }`,
    [isAnimating]
  );

  return (
    <div className={containerClassName}>
      <SidebarContent
        folderStructure={folderStructure}
        selectedFolder={selectedFolder}
        selectedTestcase={selectedTestcase}
      />
      <SidebarFooter />
    </div>
  );
};

export default React.memo(Sidebar);
