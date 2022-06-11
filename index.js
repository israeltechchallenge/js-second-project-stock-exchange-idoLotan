const app = () => {
  switch (document.body.id) {
    case "searchStock":
      displaySearchPage();
      break;
    case "stockInfo":
      displayCompanyPage();
      break;
  }

  function displaySearchPage() {
    async function fetchMarqueeData() {
      try {
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse?exchange=NASDAQ`;
        let response = await fetch(url);
        let data = await response.json();
        let marqueeContainer = document.getElementById("marquee__container");
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 10; i++) {
            let marqueePrice = document.createElement("div");
            marqueePrice.className = "marquee-price";
            let marqueeSymbol = document.createElement("div");
            marqueeSymbol.className = "marquee-name";
            const symbol = data[i].symbol;
            const price = `${data[i].price}$`;
            marqueeSymbol.innerHTML = symbol;
            marqueePrice.innerHTML = price;
            marqueePrice.classList.add("green");
            marqueeContainer.appendChild(marqueeSymbol);
            marqueeContainer.appendChild(marqueePrice);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchMarqueeData();

    async function dataFetch() {
      try {
        const loadingElement = showLoadingScreen();
        let searchUrl = `https:stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&amp;limit=10&amp;exchange=NASDAQ`;
        let searchResponse = await fetch(searchUrl);
        let data = await searchResponse.json();
        displaySearch(data);

        let addDataUrl = await fetchNTimes();
        let addDataResponse = await awaitJson(addDataUrl);
        getImg(addDataResponse);
        getChangesPercentage(addDataResponse);
        loadingElement.remove();
      } catch (err) {
        console.log(err);
      }
    }

    function getImg(data) {
      let aTag = document.getElementById("container").querySelectorAll("p");
      for (let i = 0; i < data.length; i++) {
        let img = document.createElement("img");
        img.src = data[i].profile.image;
        img.onerror = function () {
          aTag[i].removeChild(img);
          aTag[i].setAttribute("alt", img);
        };
        aTag[i].appendChild(img);
      }
    }

    function getChangesPercentage(data) {
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

    function fetchNTimes() {
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
    const awaitJson = (responses) =>
      Promise.all(
        responses.map((response) => {
          if (response.ok) return response.json();
          throw new Error(response.statusText);
        })
      );

    function displaySearch(data) {
      let results = document.getElementById("display-results");
      if (results.firstElementChild) {
        results.removeChild(results.firstElementChild);
      }

      let listLength = Math.min(10, data.length);
      let container = document.createElement("div");
      container.style.height = `${74 * listLength}px`;
      container.className = "container";
      container.id = "container";
      for (let i = 0; i < listLength; i++) {
        let element = `${data[i].name}  (${data[i].symbol})`;
        let aTag = document.createElement("a");
        let para = document.createElement("p");
        aTag.className = `aTag`;
        aTag.href = `company.html?symbol=${data[i].symbol}`;
        aTag.innerHTML = element;
        para.appendChild(aTag);
        container.appendChild(para);
      }
      results.appendChild(container);
    }

    function initSearch() {
      let button = document.querySelector("button");
      button.addEventListener("click", dataFetch);
    }

    initSearch();
  }

  function showLoadingScreen() {
    let loading = document.createElement("div");
    loading.innerHTML = `Loading...`;
    let displayStock = document.getElementById("loadDiv");
    displayStock.appendChild(loading);
    return loading;
  }

  function displayCompanyPage() {
    function catSymbol() {
      let urlParams = new URLSearchParams(window.location.search);
      queryString = urlParams.toString();
      let symbol = queryString.split(`=`)[1];
      return symbol;
    }

    async function fetchCompanyData() {
      const loadingElement = showLoadingScreen();
      let symbol = catSymbol();
      let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
      let response = await fetch(url);
      let data = await response.json();
      loadingElement.remove();
      displayCompanyData(data);
    }

    function displayCompanyData(data) {
      let stockDetails = document.getElementById("stock-details");
      let dataStore = {
        name: data.profile.companyName,
        price: ` Stock Price: ${data.profile.price}$`,
        description: data.profile.description,
        percentage: `(+${Number(data.profile.changesPercentage).toFixed(3)} %)`,
      };

      let img = document.createElement("img");
      img.src = data.profile.image;
      img.className = "card-img";
      stockDetails.appendChild(img);

      let container = document.createElement("div");
      for (const [key, value] of Object.entries(dataStore)) {
        let div = document.createElement("div");
        div.className = key;
        div.innerText = value;
        container.appendChild(div);
      }
      stockDetails.appendChild(container);

      let percentage = document.querySelector(".percentage");
      if (data.profile.changesPercentage < 0) {
        let change = `(${percentage.innerHTML.slice(2)}`;
        percentage.innerHTML = change;
        percentage.classList.add("red");
      } else {
        percentage.classList.add("green");
      }
    }

    function getDataForChart() {
      let symbol = catSymbol();
      let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
      return fetch(url).then((response) => response.json());
    }

    function createChart(data) {
      let ctx = document.getElementById("myChart").getContext("2d");
      let pastValuesPrice = [];
      let pastValuesDate = [];
      let pointsSelected = Math.min(8342, data.historical.length);
      let gapsBetweenPoints = Math.ceil(pointsSelected / 10);
      for (let i = 0; i < pointsSelected; i = i + gapsBetweenPoints) {
        const price = data.historical[i].close;
        const date = data.historical[i].date;
        pastValuesPrice.push(price);
        pastValuesDate.push(date);
      }

      pastValuesDate.reverse();
      pastValuesPrice.reverse();

      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: pastValuesDate,
          datasets: [
            {
              label: "Stocks price History",
              data: pastValuesPrice,
              fill: true,
              borderColor: "#2196f3",
              backgroundColor: "#2196f3",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    fetchCompanyData();
    getDataForChart().then((data) => createChart(data));
  }
};

app();
