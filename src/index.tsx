import { reload } from 'enmity/api/native';
import { get, set } from 'enmity/api/settings';
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { Dialog, React } from 'enmity/metro/common';
import Manifest from '../manifest.json'
import Settings from './components/Settings';

// Types for different compatibility layers
type CompatLayer = 'bunny' | 'vendetta' | 'revenge';

interface CompatConfig {
    enabled: boolean;
    customURL?: string;
    useCustomURL: boolean;
    lastLoaded?: number;
    version?: string;
}

const DEFAULT_URLS = {
    bunny: "https://raw.githubusercontent.com/bunny-mod/builds/main/bunny.js",
    vendetta: "https://github.com/vendetta-mod/builds/releases/latest/download/vendetta.js",
    revenge: "https://github.com/revenge-mod/revenge-builds/releases/latest/download/revenge.js"
};

const VendettaCompat: Plugin = {
    ...Manifest,

    async onStart() {
        // Load enabled compatibility layers asynchronously
        this.loadCompatibilityLayers();
    },

    async loadCompatibilityLayers() {
        const layers: CompatLayer[] = ['bunny', 'vendetta', 'revenge'];
        const loadPromises = [];

        for (const layer of layers) {
            const config = get(Manifest.name, `${layer}Config`, {
                enabled: layer === 'bunny', // Default to bunny enabled for backward compatibility
                useCustomURL: false,
                customURL: layer === 'bunny' ? "http://localhost:4040/bunny.js" : "",
                lastLoaded: 0,
                version: "unknown"
            }) as CompatConfig;

            if (config.enabled) {
                loadPromises.push(this.loadCompatLayer(layer, config));
            }
        }

        // Load all enabled layers in parallel
        if (loadPromises.length > 0) {
            try {
                await Promise.allSettled(loadPromises);
                this.showSuccessDialog();
            } catch (error) {
                console.error(`[${Manifest.name}] Error loading compatibility layers:`, error);
            }
        }
    },

    async loadCompatLayer(layer: CompatLayer, config: CompatConfig): Promise<void> {
        const cacheKey = `${layer}Code`;
        const timestampKey = `${layer}Timestamp`;
        const versionKey = `${layer}Version`;
        
        try {
            // Determine URL to use
            const url = config.useCustomURL && config.customURL 
                ? config.customURL 
                : DEFAULT_URLS[layer];

            // Check if we should use cached version (cache for 1 hour)
            const lastFetch = get(Manifest.name, timestampKey, 0) as number;
            const cachedCode = get(Manifest.name, cacheKey, null) as string | null;
            const cacheAge = Date.now() - lastFetch;
            const shouldUseCache = cachedCode && cacheAge < 3600000; // 1 hour

            let code: string;

            if (shouldUseCache) {
                code = cachedCode;
                console.log(`[${Manifest.name}] Using cached ${layer} code`);
            } else {
                console.log(`[${Manifest.name}] Fetching fresh ${layer} code from ${url}`);
                
                // Add timeout to prevent hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                try {
                    const response = await fetch(url, { 
                        signal: controller.signal,
                        cache: 'no-cache'
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        code = await response.text();
                        // Cache the successful response
                        set(Manifest.name, cacheKey, code);
                        set(Manifest.name, timestampKey, Date.now());
                        
                        // Try to extract version info
                        const versionMatch = code.match(/version["\s]*:[\s]*["']([^"']+)["']/i);
                        if (versionMatch) {
                            set(Manifest.name, versionKey, versionMatch[1]);
                        }
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (fetchError) {
                    clearTimeout(timeoutId);
                    console.warn(`[${Manifest.name}] Failed to fetch ${layer}, using cached version:`, fetchError);
                    
                    if (cachedCode) {
                        code = cachedCode;
                    } else {
                        throw new Error(`No cached ${layer} code available and fetch failed`);
                    }
                }
            }

            // Execute the code asynchronously to prevent blocking
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    try {
                        eval(code);
                        console.log(`[${Manifest.name}] Successfully loaded ${layer}`);
                        resolve();
                    } catch (evalError) {
                        console.error(`[${Manifest.name}] Failed to execute ${layer} code:`, evalError);
                        reject(evalError);
                    }
                }, 0);
            });

        } catch (error) {
            console.error(`[${Manifest.name}] Failed to load ${layer}:`, error);
            throw error;
        }
    },

    showSuccessDialog() {
        if (!get(Manifest.name, "shownEnabledDialog", false)) {
            const enabledLayers = [];
            
            if (get(Manifest.name, "bunnyConfig", { enabled: true }).enabled) enabledLayers.push("Bunny");
            if (get(Manifest.name, "vendettaConfig", { enabled: false }).enabled) enabledLayers.push("Vendetta");
            if (get(Manifest.name, "revengeConfig", { enabled: false }).enabled) enabledLayers.push("Revenge");

            Dialog.show({
                title: "Compatibility Layers Loaded",
                body: `Successfully enabled ${enabledLayers.join(", ")}. To disable, adjust settings in the plugin configuration.`,
                confirmText: "Okay",
                onConfirm: () => set(Manifest.name, "shownEnabledDialog", true)
            });
        }
    },

    onStop() {
        const layers = ['bunny', 'vendetta', 'revenge'];
        const unloadedLayers = [];

        for (const layer of layers) {
            try {
                // @ts-ignore - Access global compatibility layer objects
                const compatObj = window[layer];
                
                if (compatObj && typeof compatObj.unload === 'function') {
                    compatObj.unload();
                    unloadedLayers.push(layer);
                    console.log(`[${Manifest.name}] Successfully unloaded ${layer}`);
                }
            } catch (error) {
                console.error(`[${Manifest.name}] Error unloading ${layer}:`, error);
            }
        }

        if (unloadedLayers.length > 0) {
            Dialog.show({
                title: "Reload Required",
                body: `Unloaded ${unloadedLayers.join(", ")}. To fully disable the compatibility layers, please reload Discord.`,
                confirmText: "Reload Now",
                cancelText: "Later",
                onConfirm: () => reload()
            });
        }
    },

    getSettingsPanel() {
        return <Settings Manifest={Manifest} />
    }
};

registerPlugin(VendettaCompat);
