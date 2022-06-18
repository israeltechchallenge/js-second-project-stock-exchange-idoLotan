function showError(eror) {
  console.log(eror);
  let message = document.createElement("div");
  message.className = "eror";
  message.innerHTML = "something went wrong try again";
  let main = document.getElementById("main-page");
  main.appendChild(message);
}

class Marquee {
  constructor(element) {
    this.element = element;
  }
  async getData() {
    try {
      const response = await fetch(
        `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse?exchange=NASDAQ`
      );
      const data = await response.json();
      return data;
    } catch (eror) {
      showError(eror);
    }
  }

  async setMarqueeData() {
    const data = await this.getData();
    let container = document.createElement("div");
    container.className = "marquee";
    container.id = "marquee__container";
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
        container.appendChild(marqueeSymbol);
        container.appendChild(marqueePrice);
      }
    }
    return container;
  }
  async displayMarqueeData() {
    let container = await this.setMarqueeData();
    let marqueeContainer = this.element;
    marqueeContainer.appendChild(container);
  }
}

let marqueeElement = document.querySelector(".marquee-wrapper");
let marqueeObject = new Marquee(marqueeElement);
marqueeObject.displayMarqueeData();
