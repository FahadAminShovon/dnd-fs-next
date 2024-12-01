'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="p-8 bg-white rounded-lg shadow-xl text-center max-w-md w-full mx-4 transform transition-all hover:scale-105 duration-300">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. Our team has been notified and is
          working on a fix.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-6 p-2 bg-gray-100 rounded">
            Error ID: {error.digest}
          </p>
        )}
        <Button
          onClick={reset}
          className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
