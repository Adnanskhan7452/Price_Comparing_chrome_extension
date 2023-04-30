chrome.action.onClicked.addListener(async (tab) => {
    // const className = ".po-model_name .po-break-word"; // Replace with the desired class name
  
    // await chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     files: ['content.js']
    //   });
  
    // chrome.tabs.sendMessage(tab.id, { action: "extractTextByClass", className: className }, (response) => {
    // let text = response.texts;
    // text = encodeURI(text);
  
    // // Send extracted texts to the API
    // fetch("http://127.0.0.1:5000/api/scrape/site", { // Replace with your API endpoint URL
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         "scrapeUrl": `https://www.google.com/search?q=${text}&tbm=shop`,
    //         "section": {
    //             "class": ".KZmu8e",
    //             "children": [".sh-np__product-title", ".T14wmb b", ".sh-np__seller-container span"],
    //             "img": true
    //         }
    //     })
    // }).then(response => {
    //     // Handle API response
    //     console.log(response)
    // }).catch(error => {
    //     // Handle errors
    // });
    // });
    chrome.tabs.executeScript({
      file: "popup.js",
    });
  });
  