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
