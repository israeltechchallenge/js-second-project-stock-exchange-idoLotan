class Marquee {
  constructor(element) {
    this.element = element;
    this.data;
    this.container;
    this.url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse?exchange=NASDAQ`;
  }

  async getData() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      return data;
    } catch (eror) {
      showError(eror);
    }
  }

  async setMarqueeData() {
    let container = document.createElement("div");
    container.className = "marquee";
    container.id = "marquee__container";
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 10; i++) {
        let marqueePrice = document.createElement("div");
        marqueePrice.className = "marquee-price";
        let marqueeSymbol = document.createElement("div");
        marqueeSymbol.className = "marquee-name";
        const symbol = this.data[i].symbol;
        const price = `${this.data[i].price}$`;
        marqueeSymbol.innerHTML = symbol;
        marqueePrice.innerHTML = price;
        marqueePrice.classList.add("green");
        container.appendChild(marqueeSymbol);
        container.appendChild(marqueePrice);
      }
    }
    this.container = container;
  }
  async displayMarqueeData() {
    let marqueeContainer = this.element;
    marqueeContainer.appendChild(this.container);
  }
  async load() {
    this.data = await this.getData();
    this.setMarqueeData();
    this.displayMarqueeData();
  }
}
