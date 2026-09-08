import React from 'react';

interface WorkspaceSkeletonProps {
  type?: 'card' | 'summary' | 'grid' | 'flashcard';
}

export const WorkspaceSkeleton: React.FC<WorkspaceSkeletonProps> = ({ type = 'summary' }) => {
  if (type === 'flashcard') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-md mx-auto" />
        <div className="h-2 w-full bg-gray-200 rounded-full" />
        <div className="h-80 bg-white border border-edge rounded-3xl p-8 flex flex-col justify-between shadow-subtle">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-xl mx-auto" />
        </div>
        <div className="flex justify-between items-center px-4">
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white border border-edge rounded-2xl p-5 space-y-3">
              <div className="h-5 w-1/2 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-100 rounded-lg" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-8 w-2/3 bg-gray-200 rounded-lg" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Main card skeleton */}
      <div className="bg-white border border-edge rounded-2xl p-6 sm:p-8 space-y-6 shadow-subtle">
        <div className="h-6 w-48 bg-gray-200 rounded-md" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-11/12 bg-gray-100 rounded" />
          <div className="h-4 w-4/5 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="h-24 bg-gray-50 border border-edge rounded-xl p-4" />
          <div className="h-24 bg-gray-50 border border-edge rounded-xl p-4" />
        </div>
      </div>
    </div>
  );
};
