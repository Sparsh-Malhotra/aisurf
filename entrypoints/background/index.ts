import { defineBackground } from 'wxt/sandbox';

interface PageContent {
    title: string;
    url: string;
    text: string;
    description: string;
    headings: string[];
}

export default defineBackground({
    main() {
        let currentContent: PageContent | null = null;

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'PAGE_CONTENT') {
                currentContent = message.content;
            }
            if (message.type === 'GET_CONTENT') {
                sendResponse(currentContent);
            }
            return true;
        });
    }
});
