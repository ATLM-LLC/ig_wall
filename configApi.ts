import { GalleryConfig } from './types';
import { DEFAULT_CONFIG } from './constants';

/**
 * Fetches the gallery configuration from the backend.
 * 
 * !!! THIS IS A PLACEHOLDER FOR A BACKEND CALL !!!
 * In a real application, this function would make a GET request to your server,
 * which would read the `config.json` file (or from a database) and return it.
 * 
 * @returns A promise that resolves with the gallery configuration.
 */
export const fetchConfig = async (): Promise<GalleryConfig> => {
    console.log('[FRONTEND-STUB] Fetching gallery configuration from backend...');

    /*
    // --- EXAMPLE: REAL IMPLEMENTATION ---
    const response = await fetch('/api/config');
    if (!response.ok) {
        throw new Error('Failed to fetch config.');
    }
    return await response.json();
    */

    // Simulate network delay. In a real app, you might get a saved config.
    // Here we just return the default.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(DEFAULT_CONFIG);
        }, 800);
    });
};

/**
 * Saves the gallery configuration to the backend.
 * 
 * !!! THIS IS A PLACEHOLDER FOR A BACKEND CALL !!!
 * In a real application, this function would make a POST request to your server
 * with the new configuration in the body. The server would then overwrite the
 * `config.json` file.
 * 
 * @param config The new gallery configuration object to save.
 * @returns A promise that resolves when the save is complete.
 */
export const saveConfig = async (config: GalleryConfig): Promise<void> => {
    console.log('[FRONTEND-STUB] Saving gallery configuration to backend:', config);

    /*
    // --- EXAMPLE: REAL IMPLEMENTATION ---
    const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
    });
    if (!response.ok) {
        throw new Error('Failed to save config.');
    }
    */

    // Simulate network delay for the save operation.
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Uncomment the next line to test error handling
            // if (Math.random() > 0.8) return reject(new Error("Simulated network error"));
            resolve();
        }, 1000);
    });
};
