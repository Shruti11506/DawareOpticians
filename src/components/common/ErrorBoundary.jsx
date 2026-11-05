import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-softwhite-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-graphite-200 rounded-2xl p-8 shadow-card text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-sunshine-600 border border-amber-200 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-graphite-900">Something went wrong</h2>
              <p className="text-xs text-graphite-500 mt-1">
                {this.state.error?.message || "An unexpected error occurred while rendering the dashboard."}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-sunshine w-full py-2.5 font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

