function displayCompanyPage() {
  function catSymbol() {
    let params = new URLSearchParams(window.location.search);
    let symbol = params.get("symbol");
    return symbol;
  }

  async function fetchCompanyData() {
    const loadingElement = showLoadingScreen();
    try {
      let symbol = catSymbol();
      let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
      let response = await fetch(url);
      let data = await response.json();
      loadingElement.remove();
      return data;
    } catch (eror) {
      showError(eror);
      loadingElement.remove();
    }
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

  async function getDataForChart() {
    try {
      let symbol = catSymbol();
      let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
      let response = await fetch(url);
      let data = await response.json();
      return data;
    } catch (eror) {
      console.log(eror);
    }
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
  const init = async () => {
    let companyData = await fetchCompanyData();
    displayCompanyData(companyData);
    let chartData = await getDataForChart();
    createChart(chartData);
  };
  init();
}

displayCompanyPage();
