function getArticleText(){
    const para = document.querySelector("#mw-content-text");
    if (para) return para.innerText;

    const paragraphs = [...document.querySelectorAll("p")];
    return paragraphs.map(p => p.innerText).join("\n");
}

// LISTENER — REQUIRED
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "GET_ARTICLE_TEXT") {
        sendResponse({ text: getArticleText() });
    }
});
