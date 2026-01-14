import { useState, useEffect, useCallback, useRef } from 'react';
import { getTaskStatus } from '@/features/users/api/music-api';
import { TaskProgress, DancePlanReposnse } from '@/types/music';

interface UseTaskProgressOptions {
  taskId: string | null;
  onComplete?: (result: DancePlanReposnse) => void;
  onError?: (error: string) => void;
  pollingInterval?: number; // in milliseconds
}

export const useTaskProgress = ({
  taskId,
  onComplete,
  onError,
  pollingInterval = 2000, // Poll every 2 seconds
}: UseTaskProgressOptions) => {
  const [progress, setProgress] = useState<number>(0);
  const [backendProgress, setBackendProgress] = useState<number>(0);
  const [status, setStatus] = useState<TaskProgress['status'] | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth progress animation
  useEffect(() => {
    if (taskId && isPolling) {
      // Clear any existing animation interval
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      // Animate progress smoothly towards backend progress
      animationIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          // If we've reached backend progress, stop here
          if (prev >= backendProgress) {
            // Add small increment even when waiting for backend (max 95%)
            if (prev < 95 && status !== 'completed') {
              return Math.min(prev + 0.3, 95);
            }
            return prev;
          }
          
          // Smoothly approach backend progress
          const diff = backendProgress - prev;
          const increment = Math.max(0.5, diff / 10); // Smooth acceleration
          return Math.min(prev + increment, backendProgress);
        });
      }, 50); // Update every 50ms for smooth animation

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [taskId, isPolling, backendProgress, status]);

  const pollProgress = useCallback(async () => {
    if (!taskId) return;

    try {
      const progressData = await getTaskStatus(taskId);
      
      setBackendProgress(progressData.progress);
      setStatus(progressData.status);
      setMessage(progressData.message || '');

      if (progressData.status === 'completed' && !hasCompleted) {
        setIsPolling(false);
        setProgress(100); // Immediately jump to 100% on completion
        setHasCompleted(true);
        if (onComplete && progressData.result) {
          onComplete(progressData.result);
        }
      } else if (progressData.status === 'failed' && !hasFailed) {
        setIsPolling(false);
        setHasFailed(true);
        if (onError) {
          onError(progressData.error || 'Task failed');
        }
      }
    } catch (error) {
      console.error('Error polling progress:', error);
      setIsPolling(false);
      if (onError && !hasFailed) {
        setHasFailed(true);
        onError('Không thể kiểm tra tiến trình');
      }
    }
  }, [taskId, onComplete, onError, hasCompleted, hasFailed]);

  useEffect(() => {
    if (taskId && isPolling) {
      const interval = setInterval(pollProgress, pollingInterval);
      
      // Initial poll immediately
      pollProgress();

      return () => clearInterval(interval);
    }
  }, [taskId, isPolling, pollingInterval, pollProgress]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setBackendProgress(0);
    setStatus(null);
    setMessage('');
    setIsPolling(false);
    setHasCompleted(false);
    setHasFailed(false);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
  }, []);

  return {
    progress,
    status,
    message,
    isPolling,
    startPolling,
    stopPolling,
    reset,
  };
};
