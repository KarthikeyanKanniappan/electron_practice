const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");

setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

const btn = document.getElementById("btn1");
const filePathElement = document.getElementById("filePath");

btn.addEventListener("click", async () => {
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerHTML = filePath;
});

const btn3 = document.getElementById("btn3");
btn3.addEventListener("click", async () => {
  let know = await window.electronAPI.message();
  console.log(know);
});

const counter = document.getElementById("counter");
window.electronAPI.handleCounter((event, value) => {
  console.log(value);
  const oldValue = +counter.innerHTML;
  const newValue = oldValue + value;
  counter.innerText = newValue;
});

// window.electronAPI.grammerExt((event, value) => {
//   const Grammerly = value;
// });

// Extension add-on
// window.addEventListener("DOMContentLoaded",()=>{
//   const textarea= document.getElementById("review")

//   textarea.addEventListener("input",()=>{

//   })
// })

Grammarly.init().then((grammarly) => {
  window.electronAPI.registerGrammarlyAuthCallback((url) => {
    grammarly.handleOAuthCallback(url);
  });
});

window.onload = () => {
  const webview = document.querySelector("#webview");
  const loading = document.querySelector(".loading");
  webview.addEventListener("did-start-loading", () => {
    console.log("did-start-loading");
  });
  webview.addEventListener("did-stop-loading", () => {
    console.log("did-stop-loading");
  });
  webview.addEventListener("dom-ready", () => {
    console.log("dom-ready");
  });
};

const handleStream = (stream) => {
  console.log(stream);
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = (e) => video.play();
};

const handleError = (e) => {
  console.log(e);
};

const getResource = async () => {
  console.log(22);
  const sourceId = await window.electronAPI.getSources();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });
    handleStream(stream);
  } catch (e) {
    handleError(e);
  }
};

getResource();
