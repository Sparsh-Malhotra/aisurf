import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
    matches: ['*://*/*'],
    main() {
        const extractContent = () => {
            const title = document.title;
            const url = window.location.href;
            const content = {
                title,
                url,
                text: document.body.innerText,
                description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent).filter(Boolean)
            };

            chrome.runtime.sendMessage({ type: 'PAGE_CONTENT', content });
        };

        extractContent();
    }
});
