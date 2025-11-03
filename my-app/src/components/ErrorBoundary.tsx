import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-red-200 p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-16 w-16 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 text-center mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
              Don't worry, your data is safe.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details:</h3>
                <pre className="text-xs text-red-700 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <Home className="h-5 w-5" />
                <span>Go to Home</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              If this problem persists, please{' '}
              <a href="/contact" className="text-blue-600 hover:underline">
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
