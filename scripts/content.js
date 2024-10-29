console.log("utf8/script/content.js:LOADED");

function repairText(text) {
    if (!text) return text;
    return text.replace(/&#([0-9]+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

function repairAllTextContent() {
    let elements = document.querySelectorAll('*');
    elements.forEach(el => {
        if (el.childNodes.length) {
            el.childNodes.forEach(child => {
                if (child.nodeType === 3) {
                    child.nodeValue = repairText(child.nodeValue);
                }
            });
        }
        if (el.tagName === 'BUTTON' || el.tagName === 'TEXTAREA') {
            el.textContent = repairText(el.textContent);
        }
        
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'button')) {
            el.value = repairText(el.value);
        }
    });
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "run") {
        console.log("Running repair text function...");
        repairAllTextContent();
        sendResponse({ status: "completed" });
    }
    return true;
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                repairText(node.textContent);
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});