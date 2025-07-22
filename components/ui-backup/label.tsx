'use client';
import React from 'react';

export default function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-text-primary mb-1 font-medium">
      {children}
    </label>
  );
}
