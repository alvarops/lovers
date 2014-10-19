var data = {};
$("#settingsPage").bind("pageshow", function(event) {
  var url = getUrlVars();
  var index = 0;
  while (url["c" + index]) {
    data["c" + index] = url["c" + index];
    index++;
  }

  $("#toIndex").mouseover(function() {
    var query = getQueryString();
    this.href = "index.html" + query;
  });

  $("#toContacts").mouseover(function() {
    var query = getQueryString();
    this.href = "contacts.html" + query;
  });

  var url = getUrlVars();
  if (url.timeToWait && url.timeToWait !== 'undefined') {
    $("#timeToWait").val(url.timeToWait);
    $('#timeToWait').slider('refresh');
  }
  if (url.distanceToWait && url.distanceToWait !== 'undefined') {
    $("#distanceToWait").val(url.distanceToWait);
    $('#distanceToWait').slider('refresh');
  }
  if (url.tryToReach && url.tryToReach !== 'undefined') {
    $("#tryToReach").val(url.tryToReach);
    $('#tryToReach').slider('refresh');
  }
});

function getQueryString() {
  var query = "?";
  query += "timeToWait=" + $("#timeToWait").val();
  query += "&distanceToWait=" + $("#distanceToWait").val();
  query += "&tryToReach=" + $("#tryToReach").val();
  var index = 0;
  while (data["c" + index]) {
    query += "&c" + index + "=" + data["c" + index];
    index++;
  }

  return query;
}

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