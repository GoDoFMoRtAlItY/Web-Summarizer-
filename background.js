chrome.runtime.onInstalled.addListener(()=>{
    chrome.stroage.sync.get(["gem_api_key"],(result)=>{
        if(!result.gem_api_key){
            chrome.tabs.create({url:"option.html"});
        }
    })
})