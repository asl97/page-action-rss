function copyOnClick(event) {
  var a = event.currentTarget;
  copyLink(a.href)
}

function copyLink(url){
  var aux = document.createElement("input");

  aux.setAttribute("value", url);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  chrome.notifications.create("page action rss", {
    type: "basic",
    title: "Page Action RSS",
    message: "Link copied!",
    iconUrl: "/img/feed-icon-64x64.png"
  });
}

function copyElement(url){
  var copy_link = document.createElement('a');
  copy_link.href = url;
  copy_link.addEventListener("click", copyOnClick);
  return copy_link;
}
