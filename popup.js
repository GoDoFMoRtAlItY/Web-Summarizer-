document.getElementById("summarize").addEventListener("click", () => {
    const result = document.getElementById("result");
    const summaryType = document.getElementById("summary-type");
    result.textContent = "Extracting text...";

    //Get user API
    chrome.storage.sync.get(["geminiApiKey"],({geminiApiKey})=>{
        if(!geminiApiKey)
        {
            result.textContent="No APi";
            return;
        }
    });
    //Ask For Text
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async({text}) => {
        if (!text) {
            result.textContent = "Couldm't extract tesxt from this page.";
            return;
        }
        try{
            const summary=await getGeminiSummary(text,summaryType,geminiApiKey);
            result.textContent=summary;
        }
        catch(error){
            result.textContent="Gemini error : " +err.message;
        }
    });
    });

    //Send text to gemini
    async function getGeminiSummary(rawText,type,api){
        const max=20000;
        const text=rawText.length>max?rawText.slice(0,max)+"...":rawtext;
        const promptMap={
            brief:`Summarize in 2-3 sentences :\n\n${text}`,
            detailed:`Give a detailed summary :\n\n${text}`,
            bullets:`Summarize in 5 to 7 bullet points (start each line with "*  ") :\n\n${text}`,
        };
        const promt=promptMap[type]||promptMap.brief;
        const res = await fetch(``);
    }
        
    

});
