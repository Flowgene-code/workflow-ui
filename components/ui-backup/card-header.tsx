'use client';
import React from 'react';

export default function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-4 py-2 text-lg font-semibold text-text-primary ${className}`}>
      {children}
    </div>
  );
}
