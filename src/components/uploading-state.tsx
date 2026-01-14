import React from 'react';
import UploadingGif from './ui/uploading-gif';

interface LoadingStateProps {
  message?: string;
}

export default function UpLoadingState({ message = "" }: LoadingStateProps) {
  return (
    <div className="">
      <div className="flex items-center justify-center">
        <UploadingGif size="xl" />
      </div>
      {message && (
        <div className="text-center text-gray-600 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
