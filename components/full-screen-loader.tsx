'use client';

import PropagateLoader from 'react-spinners/PropagateLoader';

interface FullScreenLoaderProps {
  isLoading?: boolean;
}

export function FullScreenLoader(props?: FullScreenLoaderProps) {
  const isLoading = props?.isLoading ?? true;
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <PropagateLoader />
    </div>
  );
}
