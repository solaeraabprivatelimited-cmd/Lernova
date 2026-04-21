import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in dev; swap for Sentry in production
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorFallbackInline
          message={this.state.errorMessage}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

function ErrorFallbackInline({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      <div className="text-4xl">⚠️</div>
      <div>
        <p className="font-semibold text-foreground">Something went wrong</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {import.meta.env.DEV ? message : 'An unexpected error occurred.'}
        </p>
      </div>
      <button
        onClick={onReset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
