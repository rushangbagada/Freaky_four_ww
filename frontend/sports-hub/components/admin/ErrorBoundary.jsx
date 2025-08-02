import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Only log detailed errors in development
    if (import.meta.env.MODE === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    } else {
      console.error('Application error:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🚫 Something went wrong</h2>
            <p>We apologize for the inconvenience. The application has encountered an error.</p>
            
            {import.meta.env.MODE === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Mode)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()} 
                className="reload-btn"
              >
                Reload Page
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="back-btn"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
