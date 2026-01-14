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
  sm: 'w-15 h-15',
  md: 'w-20 h-20', 
  lg: 'w-25 h-25',
  xl: 'w-30 h-30'
};

export function LoadingGif({ 
  className = '', 
  size = 'md', 
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
          src="/loading_pop_up.gif"
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

export default LoadingGif;
