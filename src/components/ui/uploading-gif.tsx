import React from 'react';
import Image from 'next/image';

interface LoadingGifProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  showMessage?: boolean;
  centered?: boolean;
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-30 h-30', 
  lg: 'w-40 h-40',
  xl: 'w-70 h-70'
};

export function UploadingGif({ 
  className = '', 
  size = 'xl', 
  message, 
  showMessage = false,
  centered = true 
}: LoadingGifProps) {
  const containerClass = centered 
    ? 'flex flex-col items-center justify-center'
    : 'flex flex-col items-start';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`${sizeClasses[size]} relative bg-transparent`}>
        <Image
          src="/loading.gif"
          alt="Loading..."
          width={96}
          height={96}
          className="w-full h-full object-contain"
          priority
          unoptimized // Để GIF có thể hoạt động
        />
      </div>
      {showMessage && message && (
        <span className="mt-2 text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
}

export default UploadingGif;
