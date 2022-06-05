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
    function showLoadingScreen() {
      let loading = document.createElement("div");
      loading.innerHTML = `Loading...`;
      let loadDiv = document.getElementById("loadDiv");
      loadDiv.appendChild(loading);
      return loading;
    }

    function dataFetch() {
      const loadingElement = showLoadingScreen();
      let url = `https:stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input.value}&amp;limit=10&amp;exchange=NASDAQ`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          loadingElement.remove();
          displaySearch(data);
        });
    }

    function displaySearch(data) {
      let results = document.getElementById("display-results");
      if (results.firstElementChild) {
        results.removeChild(results.firstElementChild);
      }

      let listLength = Math.min(10, data.length);
      let container = document.createElement("div");
      container.style.height = `${65 * listLength}px`;
      container.className = "container";
      for (let i = 0; i < listLength; i++) {
        let element = `${data[i].name}  (${data[i].symbol})`;
        let aTag = document.createElement("a");
        let para = document.createElement("p");
        aTag.id = `aTag`;
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

  function displayCompanyPage() {
    function fetchCompanyData() {
      let urlParams = new URLSearchParams(window.location.search);
      queryString = urlParams.toString();
      let symbol = queryString.split(`=`)[1];
      let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          displayCompanyData(data);
        });
    }

    fetchCompanyData();

    function displayCompanyData(data) {
      let stockDetails = document.getElementById("stock-details");
      let dataStore = {
        name: data.profile.companyName,
        price: `${data.profile.price}$`,
        description: data.profile.description,
        percentage: `${Number(data.profile.changesPercentage).toFixed(3)} %`,
      };

      let img = document.createElement("img");
      img.src = data.profile.image;
      stockDetails.appendChild(img);

      let container = document.createElement("div");
      for (const [key, value] of Object.entries(dataStore)) {
        let div = document.createElement("div");
        div.className = key;
        div.innerText = ` ${value}`;
        container.appendChild(div);
      }
      stockDetails.appendChild(container);

      if (data.profile.changesPercentage < 0) {
        let percentage = document.querySelector(".percentage");
        percentage.classList.add("red");
      } else {
        let percentage = document.querySelector(".percentage");
        percentage.classList.add("green");
      }

      function getDataForChart() {
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/AA?serietype=line`;
        return fetch(url).then((response) => response.json());
      }

      function createChart(data) {
        console.log(data);
        let ctx = document.getElementById("myChart").getContext("2d");
        let pastValuesPrice = [];
        let pastValuesDate = [];
        for (let i = 0; i < data.historical.length / 2; i = i + 500) {
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

      getDataForChart().then((data) => createChart(data));
    }
  }
};

app();
