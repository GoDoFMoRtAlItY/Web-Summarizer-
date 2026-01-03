document.getElementById("summarize").addEventListener("click", () => {
    const result = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;

    result.textContent = "Extracting text...";

    //  Get API key
    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            result.textContent = "❌ Gemini API key not found. Open settings.";
            return;
        }

        // Get article text
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (res) => {
                if (chrome.runtime.lastError) {
                    result.textContent = chrome.runtime.lastError.message;
                    return;
                }

                const text = res?.text;
                if (!text) {
                    result.textContent = "Couldn't extract text from this page.";
                    return;
                }

                try {
                    result.textContent = "Summarizing...";
                    const summary = await getGeminiSummary(text, summaryType, geminiApiKey);
                    result.textContent = summary;
                } catch (error) {
                    result.textContent = "Gemini error: " + error.message;
                }
            });
        });
    });
});
async function getGeminiSummary(rawText, type, apiKey) {
    const MAX = 20000;
    const text = rawText.length > MAX ? rawText.slice(0, MAX) + "..." : rawText;

    const promptMap = {
        brief: `Summarize in 2–3 sentences:\n\n${text}`,
        detailed: `Give a detailed summary:\n\n${text}`,
        bullets: `Summarize in 5–7 bullet points (start each with "* "):\n\n${text}`
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.2
                }
            })
        }
    );

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error?.message || "Request failed");
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated.";
}
document.getElementById("copy-btn").addEventListener('click',()=>{
    const txt = document.getElementById("result").innerText;
    if(!txt) return;

    navigator.clipboard.writeText(txt).then(()=>{
        const btn =document.getElementById("copy-btn");
        const old=btn.textContent;
        btn.textContent="Copied";
        setTimeout(()=>(btn.textContent=old),2000);
    });
});
