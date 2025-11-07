import React from 'react';
import { GalleryConfig } from '../types';

interface ConfigPanelProps {
  config: GalleryConfig;
  setConfig: React.Dispatch<React.SetStateAction<GalleryConfig>>;
}

const ConfigInput: React.FC<{label: string, children: React.ReactNode, helpText?: string}> = ({label, children, helpText}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    {children}
    {helpText && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>}
  </div>
);

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  const handleChange = <K extends keyof GalleryConfig>(key: K, value: GalleryConfig[K]) => {
    setConfig(prevConfig => ({ ...prevConfig, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mt-2 mb-2 text-gray-800 dark:text-gray-200">Layout & Appearance</h3>

        <div className="grid grid-cols-2 gap-4">
            <ConfigInput label="Rows">
                <input type="number" min="1" max="10" value={config.rows} onChange={e => handleChange('rows', parseInt(e.target.value, 10))} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
            </ConfigInput>
            <ConfigInput label="Columns">
                <input type="number" min="1" max="10" value={config.columns} onChange={e => handleChange('columns', parseInt(e.target.value, 10))} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500" />
            </ConfigInput>
        </div>

        <ConfigInput label="Theme">
          <select value={config.theme} onChange={e => handleChange('theme', e.target.value as GalleryConfig['theme'])} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </ConfigInput>

        <div className="flex items-center justify-between mt-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700/50">
          <label htmlFor="relative-time-toggle" className="font-medium text-gray-700 dark:text-gray-300">Use Relative Timestamps</label>
          <input id="relative-time-toggle" type="checkbox" checked={config.useRelativeTime} onChange={e => handleChange('useRelativeTime', e.target.checked)} className="h-6 w-11 rounded-full appearance-none bg-gray-300 dark:bg-gray-600 checked:bg-blue-600 transition duration-200 relative cursor-pointer before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:checked:translate-x-5" />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200">Animations</h3>
        
        <div className="flex items-center justify-between mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700/50">
          <label htmlFor="scroll-toggle" className="font-medium text-gray-700 dark:text-gray-300">Continuous Scroll</label>
          <input id="scroll-toggle" type="checkbox" checked={config.scroll} onChange={e => handleChange('scroll', e.target.checked)} className="h-6 w-11 rounded-full appearance-none bg-gray-300 dark:bg-gray-600 checked:bg-blue-600 transition duration-200 relative cursor-pointer before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:checked:translate-x-5" />
        </div>
        {config.scroll && (
          <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 mb-4">
             <ConfigInput label="Scroll Direction">
                <select value={config.scrollDirection} onChange={e => handleChange('scrollDirection', e.target.value as 'horizontal' | 'vertical')} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                </select>
            </ConfigInput>
            <ConfigInput label="Scroll Speed (px/s)" helpText={`${config.scrollSpeed} px/sec`}>
                <input type="range" min="10" max="200" value={config.scrollSpeed} onChange={e => handleChange('scrollSpeed', parseInt(e.target.value, 10))} className="w-full" />
            </ConfigInput>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700/50">
            <label htmlFor="fade-toggle" className="font-medium text-gray-700 dark:text-gray-300">Incremental Fade</label>
            <input id="fade-toggle" type="checkbox" checked={config.incrementalFade} onChange={e => handleChange('incrementalFade', e.target.checked)} className="h-6 w-11 rounded-full appearance-none bg-gray-300 dark:bg-gray-600 checked:bg-blue-600 transition duration-200 relative cursor-pointer before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:checked:translate-x-5" />
        </div>
        {config.incrementalFade && (
             <ConfigInput label="Fade Interval (s)" helpText={`${(config.incrementalFadeIntervalMs/1000).toFixed(1)}s`}>
                <input type="range" min="1000" max="20000" step="1000" value={config.incrementalFadeIntervalMs} onChange={e => handleChange('incrementalFadeIntervalMs', parseInt(e.target.value, 10))} className="w-full" />
            </ConfigInput>
        )}

        <div className="flex items-center justify-between mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700/50">
            <label htmlFor="highlight-toggle" className="font-medium text-gray-700 dark:text-gray-300">Random Highlight</label>
            <input id="highlight-toggle" type="checkbox" checked={config.randomHighlight} onChange={e => handleChange('randomHighlight', e.target.checked)} className="h-6 w-11 rounded-full appearance-none bg-gray-300 dark:bg-gray-600 checked:bg-blue-600 transition duration-200 relative cursor-pointer before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform before:checked:translate-x-5" />
        </div>
        {config.randomHighlight && (
             <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-600 mb-4">
                <ConfigInput label="Highlight Interval (s)" helpText={`${(config.randomHighlightIntervalMs/1000).toFixed(1)}s`}>
                    <input type="range" min="5000" max="60000" step="1000" value={config.randomHighlightIntervalMs} onChange={e => handleChange('randomHighlightIntervalMs', parseInt(e.target.value, 10))} className="w-full" />
                </ConfigInput>
                 <ConfigInput label="Modal Autoclose (s)" helpText={`${(config.modalAutocloseMs/1000).toFixed(1)}s`}>
                    <input type="range" min="2000" max="30000" step="1000" value={config.modalAutocloseMs} onChange={e => handleChange('modalAutocloseMs', parseInt(e.target.value, 10))} className="w-full" />
                </ConfigInput>
            </div>
        )}
    </div>
  );
};

export default ConfigPanel;
