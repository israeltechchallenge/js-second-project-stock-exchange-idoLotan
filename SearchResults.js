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
    console.log(this.data);
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

  async renderResults() {
    this.data = await this.dataFetch();
    this.displaySearch();
    let addDataUrl = await this.fetchNTimes();
    let addDataResponse = await this.awaitJson(addDataUrl);
    this.getImg(addDataResponse);
    this.getChangesPercentage(addDataResponse);
  }

  render() {
    let timer;
    const debouce = (e) => {
      const value = e.target.value;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(value);
        this.renderResults();
      }, 1000);
    };
    let input = document.getElementById("input");
    input.addEventListener("keyup", debouce);
    let button = document.getElementById("custom-button");
    button.addEventListener("click", (e) => {
      this.renderResults(e);
    });
  }
}
