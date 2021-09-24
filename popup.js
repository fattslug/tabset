document.querySelector("#open").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ type: "open-tabset" });
});
