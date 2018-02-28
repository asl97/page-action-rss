// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A dictionary keyed off of tabId that keeps track of data per tab (for
// example what feedUrl was detected in the tab).
var feedData = {};

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.msg == "feedIcon") {
    // First validate that all the URLs have the right schema.
    var input = [];
    for (var i = 0; i < request.feeds.length; ++i) {
      var a = document.createElement('a');
      a.href = request.feeds[i].href;
      if (a.protocol == "http:" || a.protocol == "https:") {
        input.push(request.feeds[i]);
      } else {
        console.log('Warning: feed source rejected (wrong protocol): ' +
                    request.feeds[i].href);
      }
    }

    if (input.length == 0)
      return;  // We've rejected all the input, so abort.

    // We have received a list of feed urls found on the page.
    // Enable the page action icon.
    feedData[sender.tab.id] = input;
    chrome.pageAction.setTitle(
      { tabId: sender.tab.id,
        title: chrome.i18n.getMessage("rss_subscription_action_title")
      });
    chrome.pageAction.show(sender.tab.id);
  } else if (request.msg == "feedDocument") {
    // We received word from the content script that this document
    // is an RSS feed (not just a document linking to the feed).
    // So, we directly copy the link to the clipboard
    chrome.pageAction.setPopup({tabId: sender.tab.id, popup:""})
    chrome.pageAction.onClicked.addListener(function( tab ){
        copyLink(tab.url)
    })
    chrome.pageAction.show(sender.tab.id);
  }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete feedData[tabId];
});
