class SearchForm {
  constructor(element) {
    this.element = element;
  }
  onSearch() {
    this.element.innerHTML = `<input  id="input" placeholder="Search Stocks..." />
    <button id="custom-button" class="fa fa-search"></button>
    <div class="load" id="loadDiv"></div>`;
  }
}
