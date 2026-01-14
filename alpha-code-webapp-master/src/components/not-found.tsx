"use client";

import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/error.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video này.
      </video>
    </div>
  );
}