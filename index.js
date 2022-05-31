function dataFetch() {
  let loading = document.createElement("div");
  loading.innerHTML = `Loading...`;
  let loadDiv = document.getElementById("loadDiv");
  loadDiv.appendChild(loading);

  let url = `https:stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&amp;limit=10&amp;exchange=NASDAQ`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loading.remove();
      let results = document.getElementById("display-results");
      if (results.firstElementChild) {
        results.removeChild(results.firstElementChild);
      }
      let container = document.createElement("div");
      let listLength = Math.min(10, data.length);
      for (let i = 0; i < listLength; i++) {
        let element = `${data[i].name}  (${data[i].symbol})`;
        let aTag = document.createElement("a");
        let para = document.createElement("p");
        aTag.href = data[i].symbol;
        aTag.innerHTML = element;
        para.appendChild(aTag);
        container.appendChild(para);
      }
      results.appendChild(container);
    });
}

function initSearch() {
  let button = document.querySelector("button");
  button.addEventListener("click", dataFetch);
}

initSearch();
