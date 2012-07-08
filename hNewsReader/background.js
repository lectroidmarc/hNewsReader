/*
 * Copyright (c) 2012 Marc Matteo All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

// Track hnews data per tab
var hNewsData = {};

// Listen for messgaes telling us to show the news icon
chrome.extension.onMessage.addListener(function (request, sender) {
  // What icon should we show...
  if (!request.hNews.isValid) {
    chrome.pageAction.setIcon({
      tabId: sender.tab.id,
      path: "images/news_icon-error-19.png"
    });
  } else if (request.hNews.isValid && request.hNews.license && request.apBeacon && request.apBeacon.isValid) {
    chrome.pageAction.setIcon({
      tabId: sender.tab.id,
      path: "images/news_icon-newsright-19.png"
    });
  }
  chrome.pageAction.show(sender.tab.id);

  // Save the data so the popup can display it
  hNewsData[sender.tab.id] = request;
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete hNewsData[tabId];
});
