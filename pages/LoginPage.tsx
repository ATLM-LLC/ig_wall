import React from 'react';
import { getGoogleAuthUrl } from '../auth';
import { GoogleIcon } from '../components/Icons';

const LoginPage: React.FC = () => {

  const handleLoginClick = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Console
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your galleries.
          </p>
        </div>
        <button
          onClick={handleLoginClick}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You will be redirected to Google to authorize this application.
          </p>
      </div>
    </div>
  );
};

export default LoginPage;