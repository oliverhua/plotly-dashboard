import React, { useCallback, useMemo } from 'react';

import { DISPLAY_NAMES } from '../../constants';
import { formatFolderName, sortFilesByNumber } from '../../utils/helpers';

import FileItem from './FileItem';
import { CheckmarkIcon, ChevronDownIcon } from './icons';
import type { FolderItemProps } from './types';

const FolderItem: React.FC<FolderItemProps> = React.memo(
  ({ folder, files, isSelected, selectedFile }) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();

      // Don't trigger animation for folder clicks - only toggle the details
      // Animation should only happen when selecting files, not folders
      const details = e.currentTarget.closest('details');
      if (details) {
        details.open = !details.open;
      }
    }, []);

    const folderDisplay = useMemo(() => formatFolderName(folder), [folder]);

    // Sort files by their sample number
    const sortedFiles = useMemo(() => sortFilesByNumber(files), [files]);

    return (
      <li>
        <details
          className="group [&_summary::-webkit-details-marker]:hidden"
          open={isSelected}
        >
          <summary
            className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 transition-all duration-300 ${
              isSelected
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-md border-l-4 border-blue-500 scale-105 ring-2 ring-blue-200 ring-opacity-50'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            onClick={handleClick}
          >
            <div className="flex items-center gap-2">
              {isSelected && <CheckmarkIcon />}
              <span className="text-sm font-medium">{folderDisplay}</span>
            </div>

            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <ChevronDownIcon />
            </span>
          </summary>

          <ul className="mt-2 space-y-1 px-4">
            {sortedFiles.map(file => (
              <FileItem
                key={file}
                folder={folder}
                file={file}
                isSelected={isSelected && selectedFile === file}
              />
            ))}
          </ul>
        </details>
      </li>
    );
  }
);

FolderItem.displayName = DISPLAY_NAMES.FOLDER_ITEM;

export default FolderItem;
