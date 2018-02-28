// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function onClick(event) {
  var a = event.currentTarget;
  chrome.tabs.create({ url: a.href })
}

function feedLink(url) {
  var feed_link = document.createElement('a');
  feed_link.href = url;
  feed_link.addEventListener("click", onClick);
  return feed_link;
}

function main() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
      var feeds = backgroundPage.feedData[tab[0].id];
      var content = document.getElementById('content');
      var heading = document.getElementById('heading');
      heading.innerText = chrome.i18n.getMessage("rss_viewer_action_title");
      content.appendChild(document.createElement('br'));

      var feed_list = document.createElement('table');
      feed_list.classList.add('feedList');
      for (var i = 0; i < feeds.length; ++i) {
        // Create an RSS image and the anhor encapsulating it.
        var img_link = feedLink(feeds[i].href);
        var img = document.createElement('img');
        img.src = "../img/feed-icon-16x16.png";
        img_link.appendChild(img);

        // Create a text node and the anchor encapsulating it.
        var text_link = feedLink(feeds[i].href);
        text_link.appendChild(document.createTextNode(feeds[i].title));

        var img_clip = copyElement(feeds[i].href);
        var img2 = document.createElement('img');
        img2.src = "../img/clipboard.svg";
        img2.width = "16";
        img_clip.appendChild(img2);

        // Add the data to a row in the table.
        var tr = document.createElement('tr');
        tr.className = "feedList";
        var td = document.createElement('td');
        td.width = "16";
        td.appendChild(img_link);
        var td2 = document.createElement('td');
        td2.appendChild(text_link);
        var td3 = document.createElement('td');
        td3.appendChild(img_clip);
        tr.appendChild(td);
        tr.appendChild(td2);
        tr.appendChild(td3);
        feed_list.appendChild(tr);
      }

      content.appendChild(feed_list);
    });
  });
}

// Init on DOM ready.
document.addEventListener('DOMContentLoaded', main);
