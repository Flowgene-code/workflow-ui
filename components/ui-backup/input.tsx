'use client';
import React from 'react';

export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded border border-border bg-secondary px-3 py-2 text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition"
    />
  );
}
