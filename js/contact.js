var loader1 = document.getElementById("preloadercontact");

function undisplayloader() {
  loader1.style.display = "none";
}

const wait2Seconds = new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 2000);
});

const waitForLoad = new Promise((resolve) => {
  window.addEventListener("load", () => {
    resolve();
  });
});

Promise.all([wait2Seconds, waitForLoad]).then(() => {
  console.log("nice");
  undisplayloader();
});
