import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary – Catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div
            className="flex flex-col items-center w-full max-w-2xl p-8"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4">An unexpected error occurred.</h2>

            {/* Error details in a collapsible section for better UX */}
            <details className="w-full mb-6">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Show error details
              </summary>
              <div className="p-4 mt-2 rounded bg-muted overflow-auto">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {this.state.error?.stack || this.state.error?.message || "No error details available."}
                </pre>
              </div>
            </details>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;