'use client';
import React from 'react';

export default function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-4 py-3 text-[#2F2F2F] ${className}`}>
      {children}
    </div>
  );
}
