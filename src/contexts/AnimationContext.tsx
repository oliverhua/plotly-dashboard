import { createContext } from 'react';

// Animation context type definition
export interface AnimationContextType {
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  lastSelectedFile: string | null;
  setLastSelectedFile: (file: string | null) => void;
}

// Create Animation Context with default values
export const AnimationContext = createContext<AnimationContextType>({
  isAnimating: false,
  setIsAnimating: () => {},
  lastSelectedFile: null,
  setLastSelectedFile: () => {},
}); 