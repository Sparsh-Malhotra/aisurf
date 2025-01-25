import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest:{
    name: 'AISurf',
    description: 'Chat with websites using AI',
    version: '0.0.1',
    permissions: [
        'activeTab',
        'storage'
    ],
    host_permissions: ['<all_urls>']
  },
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
});
