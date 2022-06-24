class SearchResults {
  constructor(element) {
    this.element = element;
    this.data;
  }

  async dataFetch() {
    const loadingElement = showLoadingScreen();
    try {
      let searchUrl = `https:stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&amp;limit=10&amp;exchange=NASDAQ`;
      let searchResponse = await fetch(searchUrl);
      let data = await searchResponse.json();
      data;
      loadingElement.remove();
      return data;
    } catch (eror) {
      loadingElement.remove();
      clearEror();
      showError(eror);
    }
  }

  getImg(data) {
    let aTag = document.getElementById("container").querySelectorAll("p");
    for (let i = 0; i < data.length; i++) {
      let img = document.createElement("img");
      img.src = data[i].profile.image;
      img.onerror = () => {
        img.src = "img/img.png";
      };
      aTag[i].appendChild(img);
    }
  }

  getChangesPercentage(data) {
    let aTag = document.getElementById("container").querySelectorAll(".aTag");
    for (let i = 0; i < data.length; i++) {
      let div = document.createElement("div");
      div.className = "changesPercentage";
      if (data[i].profile.changesPercentage < 0) {
        div.innerHTML = `${data[i].profile.changesPercentage}%`;
        div.classList.add("red");
      } else {
        div.innerHTML = `+${data[i].profile.changesPercentage}%`;
        div.classList.add("green");
      }
      aTag[i].appendChild(div);
    }
  }

  fetchNTimes() {
    let aTag = document.getElementById("container").querySelectorAll(".aTag");
    let symbolArray = [];
    aTag.forEach((element) =>
      symbolArray.push(element.innerHTML.split("(")[1].split(")")[0])
    );
    let responses = [];
    for (let i = 0; i < symbolArray.length; i++) {
      let symbol = symbolArray[i];
      let response = fetch(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
      );

      responses.push(response);
    }
    return Promise.all(responses);
  }
  awaitJson = (responses) =>
    Promise.all(
      responses.map((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
    );

  displaySearch() {
    let results = document.getElementById("results");
    if (results.firstElementChild) {
      results.removeChild(results.firstElementChild);
    }
    let listLength = Math.min(10, this.data.length);
    let container = document.createElement("div");
    container.style.height = `${74 * listLength}px`;
    container.className = "container";
    container.id = "container";
    for (let i = 0; i < listLength; i++) {
      let element = `${this.data[i].name}  (${this.data[i].symbol})`;
      let aTag = document.createElement("a");
      let para = document.createElement("p");
      aTag.className = `aTag`;
      aTag.href = `company.html?symbol=${this.data[i].symbol}`;
      aTag.innerHTML = element;
      para.appendChild(aTag);
      container.appendChild(para);
    }
    results.appendChild(container);
  }

  highlight() {
    let inputText = document.getElementById("input").value.trim();
    let text;
    let aTag = document.getElementById("container").querySelectorAll(".aTag");
    aTag.forEach((element) => {
      text = element.innerHTML;
      for (let i = 0; i < text.length; i++) {
        if (
          text.substring(i, i + inputText.length).toUpperCase() ==
          inputText.toUpperCase()
        ) {
          element.innerHTML = text
            .split(text.substring(i, i + inputText.length))
            .join(
              '<span class="highlight">' +
                text.substring(i, i + inputText.length) +
                "</span>"
            );
        }
      }
    });
  }

  async renderResults() {
    this.data = await this.dataFetch();
    this.displaySearch();
    let addDataUrl = await this.fetchNTimes();
    let addDataResponse = await this.awaitJson(addDataUrl);
    this.getImg(addDataResponse);
    this.getChangesPercentage(addDataResponse);
    this.highlight();
  }

  render() {
    let timer;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.renderResults();
      }, 1000);
    };
    let input = document.getElementById("input");
    input.addEventListener("keyup", debounce);
    let button = document.getElementById("custom-button");
    button.addEventListener("click", (e) => {
      this.renderResults(e);
    });
  }
}
