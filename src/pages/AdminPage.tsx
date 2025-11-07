import React, { useEffect, useState } from 'react';
import { GalleryConfig } from '../types';
import ConfigPanel from '../components/ConfigPanel';
import { LogoutIcon, InstagramIcon, RefreshIcon } from '../components/Icons';

interface AdminPageProps {
  config: GalleryConfig;
  onSaveConfig: (newConfig: GalleryConfig) => Promise<boolean>;
  onLogout: () => void;
  isInstagramConnected: boolean;
  instagramUsername: string | null;
  isRefreshingPosts: boolean;
  onConnectInstagram: () => void;
  onDisconnectInstagram: () => void;
  onRefreshPosts: () => Promise<void>;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

const AdminPage: React.FC<AdminPageProps> = ({ 
    config, onSaveConfig, onLogout, 
    isInstagramConnected, instagramUsername, isRefreshingPosts,
    onConnectInstagram, onDisconnectInstagram, onRefreshPosts
}) => {
  const [localConfig, setLocalConfig] = useState<GalleryConfig>(config);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    // When the initial config is loaded, update the local state
    setLocalConfig(config);
  }, [config]);
    
  useEffect(() => {
    document.documentElement.classList.toggle('dark', localConfig.theme === 'dark');
    if (localConfig.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, [localConfig.theme]);

  const handleSave = async () => {
    setSaveStatus('saving');
    const success = await onSaveConfig(localConfig);
    if (success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000); // Reset after 2s
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000); // Let user see error
    }
  };

  const isConfigDirty = JSON.stringify(config) !== JSON.stringify(localConfig);

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'success': return 'Saved!';
      case 'error': return 'Save Failed';
      default: return 'Save Changes';
    }
  };

  const renderInstagramSection = () => {
    if (isInstagramConnected) {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">Connected as:</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <InstagramIcon />
                        {instagramUsername}
                    </p>
                </div>
                <button onClick={onDisconnectInstagram} className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">
                    Disconnect
                </button>
            </div>
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button 
                    onClick={onRefreshPosts}
                    disabled={isRefreshingPosts}
                    className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    <RefreshIcon spinning={isRefreshingPosts} />
                    {isRefreshingPosts ? 'Refreshing...' : 'Refresh Posts'}
                </button>
            </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Connect your Instagram account to start pulling in your latest posts.</p>
          <button 
            onClick={onConnectInstagram} 
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
          >
              <InstagramIcon />
              Connect with Instagram
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You will be redirected to Instagram to authorize this application.
          </p>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-2xl font-bold">Admin Console</h1>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.location.hash = '/'}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                    View Gallery
                </button>
                <button 
                    onClick={onLogout} 
                    className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                    aria-label="Logout"
                >
                    <LogoutIcon/>
                    <span>Logout</span>
                </button>
            </div>
        </header>
        <main className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Instagram Account</h2>
                    {renderInstagramSection()}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                        <h2 className="text-xl font-semibold">Gallery Configuration</h2>
                        <button
                          onClick={handleSave}
                          disabled={!isConfigDirty || saveStatus === 'saving'}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors
                            ${!isConfigDirty ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
                            ${isConfigDirty && saveStatus !== 'saving' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                            ${saveStatus === 'saving' ? 'bg-blue-400 text-white cursor-wait' : ''}
                            ${saveStatus === 'success' ? 'bg-green-600 text-white' : ''}
                            ${saveStatus === 'error' ? 'bg-red-600 text-white' : ''}
                          `}
                        >
                            {getSaveButtonText()}
                        </button>
                    </div>
                    <ConfigPanel config={localConfig} setConfig={setLocalConfig} />
                </div>
            </div>
        </main>
    </div>
  );
};

export default AdminPage;