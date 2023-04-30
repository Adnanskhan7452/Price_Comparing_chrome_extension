function extractTextByClass(params) {
    let texts = '';
    params.forEach(queryString => {
        const element = document.querySelector(queryString);
        if(element){
            texts += element.innerText + " "
        }
    });
    console.log(texts)
    return texts.trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractTextByClass") {
        const texts = extractTextByClass(request.params);
        sendResponse({ texts: texts });
    }
});