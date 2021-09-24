// const config = require("./config.json");
self.importScripts("./config.js");

const addTabs = async (urls, options) => {
  for (let url of urls) {
    await chrome.tabs.create({
      url,
      pinned: options && options.pinned,
    });
  }
};

const addGroupedTabs = async (title, urls) => {
  const tabs = [];
  for (let url of urls) {
    tabs.push(await chrome.tabs.create({ url }));
  }
  const group = await chrome.tabs.group({ tabIds: tabs.map((t) => t.id) });
  await chrome.tabGroups.update(group, { title, collapsed: true });
};

chrome.runtime.onMessage.addListener(async ({ type }) => {
  if (type === "open-tabset") {
    for (let [tabType, entries] of Object.entries(tabMap)) {
      switch (tabType) {
        case "solo":
          addTabs(entries);
          break;
        case "pinned":
          addTabs(entries, { pinned: true });
          break;
        case "grouped":
          for (let [title, urls] of Object.entries(entries)) {
            addGroupedTabs(title, urls);
          }
          break;
        default:
          console.error("Unrecognized tab type");
          throw new Error("Unrecognized tab type");
      }
    }
  }
});
