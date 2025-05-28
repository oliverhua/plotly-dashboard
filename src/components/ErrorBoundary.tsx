import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import {
  ACCESSIBILITY,
  CSS_CLASSES,
  SOMETHING_WRONG,
  SVG_PATHS,
  TRY_AGAIN,
  UNEXPECTED_ERROR,
} from '../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={CSS_CLASSES.STATUS_CONTAINER}>
          <div className={CSS_CLASSES.STATUS_CONTENT}>
            <div
              className={`${CSS_CLASSES.STATUS_ICON} ${CSS_CLASSES.COLORS.RED.BACKGROUND} ${CSS_CLASSES.COLORS.RED.TEXT}`}
            >
              <svg
                className={CSS_CLASSES.ICON_SIZE}
                fill={ACCESSIBILITY.FILL}
                stroke={ACCESSIBILITY.STROKE}
                viewBox={ACCESSIBILITY.VIEWBOX}
                xmlns={ACCESSIBILITY.XMLNS}
              >
                <path
                  strokeLinecap={ACCESSIBILITY.STROKE_LINECAP}
                  strokeLinejoin={ACCESSIBILITY.STROKE_LINEJOIN}
                  strokeWidth={ACCESSIBILITY.STROKE_WIDTH}
                  d={SVG_PATHS.WARNING_ICON}
                />
              </svg>
            </div>
            <div
              className={`${CSS_CLASSES.STATUS_TITLE} ${CSS_CLASSES.COLORS.RED.TEXT}`}
            >
              {SOMETHING_WRONG}
            </div>
            <div className={`${CSS_CLASSES.STATUS_MESSAGE} mb-4`}>
              {this.state.error?.message || UNEXPECTED_ERROR}
            </div>
            <button
              onClick={() =>
                this.setState({
                  hasError: false,
                  error: undefined,
                })
              }
              className={`px-4 py-2 ${CSS_CLASSES.COLORS.RED.BUTTON} rounded-lg ${CSS_CLASSES.COLORS.RED.BUTTON_HOVER} ${CSS_CLASSES.TRANSITIONS.BUTTON}`}
            >
              {TRY_AGAIN}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
