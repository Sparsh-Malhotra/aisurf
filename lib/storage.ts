import {Settings} from "@/lib/types.ts";

export const storage = {
    async getSettings(): Promise<Settings> {
        const result = await chrome.storage.sync.get('settings');
        return result.settings || { apiKey: '', model: 'gpt-3.5-turbo' };
    },

    async saveSettings(settings: Settings): Promise<void> {
        await chrome.storage.sync.set({ settings });
    }
};
