var data = {};
$(document).bind("pageinit", function() {
  $("#toSettings").mouseover(function() {
    var query = "?";
    query += "timeToWait=" + data.timeToWait;
    query += "&distanceToWait=" + data.distanceToWait;
    query += "&tryToReach=" + data.tryToReach;
    var index = 0;
    while (data["c" + index]) {
      query += "&c" + index + "=" + data["c" + index];
      index++;
    }
    this.href = "settings.html" + query;
  });
});

$("#mainPage").bind("pageshow", function(event) {
  var url = getUrlVars();
  data.timeToWait = url.timeToWait;
  data.distanceToWait = url.distanceToWait;
  data.tryToReach = url.tryToReach;
  var index = 0;
  while (url["c" + index]) {
    data["c" + index] = url["c" + index];
    index++;
  }
});

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }
  return vars;
}