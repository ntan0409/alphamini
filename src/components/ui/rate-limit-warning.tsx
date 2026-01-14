"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface RateLimitWarningProps {
  onRetry?: () => void
  retryDisabled?: boolean
}

export function RateLimitWarning({ onRetry, retryDisabled }: RateLimitWarningProps) {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Rate Limit Reached
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Too many requests to the server. Showing cached data or default values. 
              The system will automatically retry in a few moments.
            </p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                disabled={retryDisabled}
                onClick={onRetry}
                className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${retryDisabled ? 'animate-spin' : ''}`} />
                {retryDisabled ? 'Retrying...' : 'Retry Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
