// function showError(eror) {
//   console.log(eror);
//   let message = document.createElement("div");
//   message.className = "eror";
//   message.innerHTML = "something went wrong try again";
//   let main = document.querySelector("body");
//   main.appendChild(message);
// }
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

// function showError(eror) {
//   let main = document.getElementById("main-page");
//   let erorContainer = document.createElement("div");
//   erorContainer.id = "eror-container";
//   console.log(eror);
//   let message = document.createElement("div");
//   message.className = "eror";
//   message.innerHTML = "something went wrong try again";
//   erorContainer.appendChild(message);
//   main.appendChild(erorContainer);
// }
