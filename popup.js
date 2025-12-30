document.getElementById("summarize").addEventListener("click", () => {
    const result = document.getElementById("result");
    result.textContent = "Extracting text...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, (res) => {
        if (chrome.runtime.lastError) {
            console.error("❌", chrome.runtime.lastError.message);
            result.textContent = "Error: " + chrome.runtime.lastError.message;
            return;
        }
        result.textContent = res?.text || "No text found";
    });
});


});
