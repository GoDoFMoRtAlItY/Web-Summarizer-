document.addEventListener("DOMContentLoaded", () => {

    // Load saved key
    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (geminiApiKey) document.getElementById("api-key").value = geminiApiKey;
    });

    // Save button
    document.getElementById("save").addEventListener("click", () => {
        const apiKey = document.getElementById("api-key").value.trim();
        if (!apiKey) return;

        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
            document.getElementById("success").style.display = "block";
            setTimeout(() => {window.close()}, 1000);
        });
    });

});
