import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
    matches: ['*://*/*'],
    main() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.type === 'EXTRACT_CONTENT') {
                const content = {
                    title: document.title,
                    url: window.location.href,
                    text: document.body.innerText,
                    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
                };
                sendResponse(content);
            }
            return true;
        });
    }
});
