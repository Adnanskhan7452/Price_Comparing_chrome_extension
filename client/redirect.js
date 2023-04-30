// Extract the search query parameter value
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("q");
const openCardQuery = urlParams.get("open");

// Do something with the search query value
// window.onload = function () {
  document.body.style.opacity = 0;
// };

if (openCardQuery.toString()) {
  document
    .querySelectorAll(".shntl.sh-np__click-target")
    [parseInt(openCardQuery)].click();
//   window.close();
}
