import React from 'react';
import * as Sentry from '@sentry/browser';

/**
 * A generic error boundary which catches errors in the component tree and
 * renders the `fallback` component instead. The error is forwarded to Sentry.
 */

interface Props {
  fallback: React.ComponentType;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, { componentStack }: React.ErrorInfo) {
    console.log(error);
    Sentry.captureException(error, { contexts: { react: { componentStack } } });
  }

  public render() {
    const { children, fallback: Fallback } = this.props;

    if (this.state.hasError) {
      return <Fallback />;
    } else {
      return children;
    }
  }
}

export default ErrorBoundary;
