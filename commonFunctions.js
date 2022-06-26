function showLoadingScreen() {
  let loading = document.createElement("div");
  loading.innerHTML = `Loading...`;
  let displayStock = document.getElementById("loadDiv");
  displayStock.appendChild(loading);
  return loading;
}

function clearEror() {
  let eror = document.querySelector(".eror");
  if (eror) {
    console.log("remove");
    eror.remove();
  }
}

function showError(eror) {
  console.log(eror);
  let message = document.createElement("div");
  message.className = "eror";
  message.innerHTML = "something went wrong try again";
  let main = document.querySelector("header");
  main.appendChild(message);
}

function search() {
  let searched = document.getElementById("input").value.trim();
  console.log(searched.length);
  if (searched.length > 1) {
    let aTag = document.getElementById("container").querySelectorAll(".aTag");
    aTag.forEach((element) => {
      let text = element.innerHTML;
      element.innerHTML = `<mark>6</mark>`;
      // console.log(text);
      // let re = new RegExp(searched, "g"); // search for all instances
      // console.log(re);

      // let newText = text.replace(re, `<mark>${searched}</mark>`);
      // document.getElementById("input").innerHTML = newText;
    });
  }
}
