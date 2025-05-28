import React, { useMemo } from 'react';

import { HEADER_HEIGHT } from '../../constants';

import FolderItem from './FolderItem';
import type { SidebarContentProps } from './types';

const SidebarContent: React.FC<SidebarContentProps> = ({
  folderStructure,
  selectedFolder,
  selectedTestcase,
}) => {
  const folders = useMemo(
    () => Object.keys(folderStructure),
    [folderStructure]
  );

  return (
    <div
      className="px-4 py-6 overflow-y-auto flex-grow overflow-x-hidden"
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E0 transparent',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <ul className="mt-1 space-y-1">
        {folders.map(folder => (
          <FolderItem
            key={folder}
            folder={folder}
            testcases={folderStructure[folder] || {}}
            isSelected={folder === selectedFolder}
            selectedTestcase={selectedTestcase}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidebarContent;
