import React, { useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ANIMATION_DURATION, DISPLAY_NAMES } from '../../constants';
import { AnimationContext } from '../../contexts/AnimationContext';
import { getFileDisplayName } from '../../utils/configUtils';

import type { FileItemProps } from './types';

const FileItem: React.FC<FileItemProps> = React.memo(
  ({ folder, file, isSelected }) => {
    const { setIsAnimating, setLastSelectedFile } =
      useContext(AnimationContext);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        // Don't do anything if this file is already selected
        if (isSelected) {
          e.preventDefault();
          return;
        }

        // Set animation state
        setIsAnimating(true);
        setLastSelectedFile(file);

        // Reset animation state after duration
        setTimeout(() => {
          setIsAnimating(false);
        }, ANIMATION_DURATION);

        // Let React Router handle the navigation
      },
      [file, setIsAnimating, setLastSelectedFile, isSelected]
    );

    // Get display name for file
    const fileDisplayName = useMemo(
      () => getFileDisplayName(file),
      [file]
    );

    // Use relative path - React Router will handle the basename
    const linkTo = `/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

    return (
      <li>
        <Link
          to={linkTo}
          className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isSelected
              ? 'bg-blue-100 text-blue-700 scale-105 shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          onClick={handleClick}
        >
          {fileDisplayName}
        </Link>
      </li>
    );
  }
);

FileItem.displayName = DISPLAY_NAMES.FILE_ITEM;

export default FileItem;
