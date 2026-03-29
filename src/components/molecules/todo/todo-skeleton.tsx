'use client';

import React from 'react';

export const TodoSkeleton = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-20 w-full rounded-3xl bg-white/5 border border-white/10 flex items-center px-6 gap-4"
        >
          <div className="h-6 w-6 rounded-lg bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-1/4 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-8 w-8 rounded-xl bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
};
