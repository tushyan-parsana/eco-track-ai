"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle } from "lucide-react";

/**
 * Props accepted by the {@link ErrorBoundary} component.
 */
interface ErrorBoundaryProps {
  /** The content to render when no error has occurred. */
  children: ReactNode;
  /** Optional custom fallback UI. If omitted a default card is shown. */
  fallback?: ReactNode;
  /** Optional callback invoked when an error is caught. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A reusable React error boundary that catches render-time errors
 * in its subtree and displays a graceful fallback UI instead of
 * crashing the whole page.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <WidgetThatMightFail />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <GlassCard className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            An unexpected error occurred while rendering this section.
            Please try again or refresh the page.
          </p>
          <Button onClick={this.handleReset} className="bg-brand-600 hover:bg-brand-700">
            Try Again
          </Button>
        </GlassCard>
      );
    }

    return this.props.children;
  }
}
