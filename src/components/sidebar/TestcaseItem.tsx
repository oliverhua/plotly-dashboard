import React, { useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ANIMATION_DURATION, DISPLAY_NAMES } from '../../constants';
import { AnimationContext } from '../../contexts/AnimationContext';

import type { TestcaseItemProps } from './types';

const TestcaseItem: React.FC<TestcaseItemProps> = React.memo(
  ({ folder, testcase, isSelected }) => {
    const { setIsAnimating, setLastSelectedFile } =
      useContext(AnimationContext);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        // Don't do anything if this testcase is already selected
        if (isSelected) {
          e.preventDefault();
          return;
        }

        // Set animation state
        setIsAnimating(true);
        setLastSelectedFile(testcase);

        // Reset animation state after duration
        setTimeout(() => {
          setIsAnimating(false);
        }, ANIMATION_DURATION);

        // Let React Router handle the navigation
      },
      [testcase, setIsAnimating, setLastSelectedFile, isSelected]
    );

    // Use relative path - React Router will handle the basename
    const linkTo = `/${encodeURIComponent(folder)}/${encodeURIComponent(testcase)}`;

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
          {testcase}
        </Link>
      </li>
    );
  }
);

TestcaseItem.displayName = DISPLAY_NAMES.TESTCASE_ITEM;

export default TestcaseItem;
