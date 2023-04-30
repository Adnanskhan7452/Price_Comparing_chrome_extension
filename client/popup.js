loadProducts();
document.getElementById("extractTextBtn").addEventListener("click", () => {
  loadProducts();
});

function createCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = data.img[0];
  card.appendChild(img);

  const content = document.createElement("div");
  content.classList.add("content");

  const title = document.createElement("h4");
  title.textContent = data.title;
  content.appendChild(title);

  const price = document.createElement("p");
  price.textContent = data.price;
  content.appendChild(price);

  const companyDetails = document.createElement("div");
  companyDetails.classList.add("company");

  const siteName = document.createElement("p");
  siteName.textContent = data.siteName;
  companyDetails.appendChild(siteName);

  const link = document.createElement("a");

  const dummyLinkDiv = document.createElement("div");
  dummyLinkDiv.innerHTML = data.href;
  link.href = encodeURI(dummyLinkDiv.innerText);
  link.target = "_blank";
  link.textContent = "View Product";
  companyDetails.appendChild(link);
  content.appendChild(companyDetails);

  card.appendChild(content);

  return card;
}

function loadProducts() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const cardContainer = document.getElementById("cardContainer");

    const params = ["#productTitle", ".B_NuCI", ".pdp-title", ".pdp-name" , ".product_title.entry-title"]; // Replace with the desired class name

    const activeTab = tabs[0];

    console.log(tabs, activeTab);
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(
      activeTab.id,
      { action: "extractTextByClass", params: params },
      (response) => {
        // Send extracted texts to the API
        let text = response.texts;
        if (!text) {
          return;
        }
        document.getElementById("productTitle").innerText = text;
        cardContainer.innerHTML = `<div class="loader"></div>`; // Clear the container

        text = encodeURI(text);
        // Send extracted texts to the API
        fetch("http://127.0.0.1:5000/api/scrape/site", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scrapeUrl: `https://www.google.com/search?q=${text}&tbm=shop`,
            section: {
              class: ".KZmu8e",
              children: {
                ".sh-np__product-title": "title",
                ".T14wmb b": "price",
                ".sh-np__seller-container span": "siteName",
              },
              img: true,
            },
          }),
        })
          .then(async (response) => {
            const res = await response.json();
            let data = res.data;
            cardContainer.innerHTML = ""; // Clear the container
            console.log(data , activeTab.url)
            data  = moveObjectsWithSameStringToBottom(data , activeTab.url)
            data.forEach((item) => {
              const card = createCard(item);
              cardContainer.appendChild(card);
            });
          })
          .catch((error) => {});
      }
    );
  });
}


function moveObjectsWithSameStringToBottom(arr, str) {
  return arr.sort((a, b) => {
    if (str.includes(a.siteName.toLowerCase()) && !str.includes(b.siteName.toLowerCase())) {
      return 1; // move a to the bottom
    } else if (!str.includes(a.siteName.toLowerCase()) && str.includes(b.siteName.toLowerCase())) {
      return -1; // move b to the bottom
    } else {
      return 0; // keep the order unchanged
    }
  });
}