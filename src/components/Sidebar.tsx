import React, { useCallback, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ANIMATION_DURATION, HEADER_HEIGHT } from '../constants';
import { AnimationContext } from '../contexts/AnimationContext';
import type { FolderStructure } from '../utils/dataUtils';
import {
  formatFolderName,
  removeFileExtension,
  sortFilesByNumber,
} from '../utils/helpers';

interface SidebarProps {
  folderStructure: FolderStructure;
  selectedFolder: string;
  selectedFile: string;
}

interface FolderItemProps {
  folder: string;
  files: readonly string[];
  isSelected: boolean;
  selectedFile: string;
}

const FileItem: React.FC<{
  folder: string;
  file: string;
  isSelected: boolean;
}> = React.memo(({ folder, file, isSelected }) => {
  const { setIsAnimating, setLastSelectedFile } = useContext(AnimationContext);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't do anything if this file is already selected
      if (isSelected) {
        e.preventDefault();
        return;
      }

      // 設置動畫狀態
      setIsAnimating(true);
      setLastSelectedFile(file);

      // Reset animation state after duration
      setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION);

      // Let React Router handle the navigation - don't call onClick
    },
    [file, setIsAnimating, setLastSelectedFile, isSelected]
  );

  // Use relative path - React Router will handle the basename
  const linkTo = `/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

  return (
    <li>
      <Link
        to={linkTo}
        className={`block rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
          isSelected
            ? 'bg-gray-100 text-gray-700 scale-105 shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
        onClick={handleClick}
      >
        {removeFileExtension(file)}
      </Link>
    </li>
  );
});

FileItem.displayName = 'FileItem';

const FolderItem: React.FC<FolderItemProps> = React.memo(
  ({ folder, files, isSelected, selectedFile }) => {
    const { setIsAnimating, setLastSelectedFile } =
      useContext(AnimationContext);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();

        // If this folder isn't already selected, trigger animation
        if (!isSelected) {
          // Set animation state
          setIsAnimating(true);

          // Clear last selected file since we're changing folders
          setLastSelectedFile(null);

          // Reset animation state after duration
          setTimeout(() => {
            setIsAnimating(false);
          }, ANIMATION_DURATION);
        }

        // Toggle the details element
        const details = e.currentTarget.closest('details');
        if (details) {
          details.open = !details.open;
        }
      },
      [isSelected, setIsAnimating, setLastSelectedFile]
    );

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
            className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-300 ${
              isSelected ? 'bg-gray-50 font-semibold' : ''
            }`}
            onClick={handleClick}
          >
            <span className="text-sm font-medium">{folderDisplay}</span>

            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
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

FolderItem.displayName = 'FolderItem';

const CurrentSelection: React.FC<{ folder: string; file: string }> = React.memo(
  ({ folder, file }) => {
    const { isAnimating } = useContext(AnimationContext);

    const className = useMemo(
      () =>
        `mt-6 rounded-lg border border-gray-100 p-4 transition-all duration-300 ${
          isAnimating ? 'bg-blue-50 scale-105' : 'bg-white'
        }`,
      [isAnimating]
    );

    const folderDisplay = useMemo(() => formatFolderName(folder), [folder]);
    const fileDisplay = useMemo(() => removeFileExtension(file), [file]);

    return (
      <div className={className}>
        <p className="text-xs text-gray-500">
          <strong className="block font-medium text-gray-700 mb-1">
            Current Selection
          </strong>
          <span className="block">Folder: {folderDisplay}</span>
          <span className="block">File: {fileDisplay}</span>
        </p>
      </div>
    );
  }
);

CurrentSelection.displayName = 'CurrentSelection';

const Footer: React.FC = React.memo(() => (
  <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
    <a
      href="#"
      className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 transition-colors duration-300"
      onClick={e => e.preventDefault()}
    >
      <div className="size-10 rounded-full bg-gray-100 grid place-content-center text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
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

Footer.displayName = 'Footer';

// 主 Sidebar 組件
const Sidebar: React.FC<SidebarProps> = ({
  folderStructure,
  selectedFolder,
  selectedFile,
}) => {
  const folders = useMemo(
    () => Object.keys(folderStructure),
    [folderStructure]
  );
  const { isAnimating } = useContext(AnimationContext);

  const containerClassName = useMemo(
    () =>
      `flex h-full flex-col justify-between border-e border-gray-100 bg-white transition-all duration-300 ${
        isAnimating ? 'shadow-lg' : ''
      }`,
    [isAnimating]
  );

  return (
    <div className={containerClassName}>
      <div
        className="px-4 py-6 overflow-y-auto flex-grow overflow-x-hidden"
        style={{
          maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 transparent',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Heatmap Data
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <a
              href="#"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300"
              onClick={e => e.preventDefault()}
            >
              Data Selection
            </a>
          </li>

          {folders.map(folder => (
            <FolderItem
              key={folder}
              folder={folder}
              files={folderStructure[folder] || []}
              isSelected={folder === selectedFolder}
              selectedFile={selectedFile}
            />
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(Sidebar);
