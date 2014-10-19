var autocompleteData = $.parseJSON('[{"label":"Wife (+353 087 654 3210)","value":"Wife"},{"label":"Mum (+353 087 658 3210)","value":"Mum"},{"label":"Dad (+353 087 655 3210)","value":"Dad"}]');

$("#contactsPage").bind("pageshow", function(e) {
  $('#items').sortable();
  $('#items').disableSelection();
  $('#items').on('sortstop', function(event, ui) {
    $('#items').listview('refresh');
  });

  $("#searchField").autocomplete({
    target: $('#suggestions'),
    source: autocompleteData,
    callback: function(e) {
      var $a = $(e.currentTarget);
      $('#searchField').val("");
      $("#searchField").autocomplete('clear');

      var matcher = new RegExp($a.data('autocomplete').value, "i");
      if (!matcher.test($("#items").html())) {
        $('#items').append('<a class="contact" href="#" data-icon="flat-cmd" data-role="button">' + $a.data('autocomplete').value + '</a>');
        $('#items').trigger('create');
      }
    },
    minLength: 1,
    matchFromStart: false
  });

  var url = getUrlVars();
  data.timeToWait = url.timeToWait;
  data.distanceToWait = url.distanceToWait;
  data.tryToReach = url.tryToReach;

  var index = 0;
  while (url["c" + index]) {
    $('#items').append('<a class="contact" href="#" data-icon="flat-cmd" data-role="button">' + url["c" + index] + '</a>');
    index++;
  }
  $('#items').trigger('create');
});

var data = {};
$(document).bind("pageinit", function() {
  $("#toSettings").mouseover(function() {
    var contacts = extractContacts();
    var query = "?";
    query += "timeToWait=" + data.timeToWait;
    query += "&distanceToWait=" + data.distanceToWait;
    query += "&tryToReach=" + data.tryToReach;
    query += contacts;
    this.href = "settings.html" + query;
  });

  $("#start").click(function() {
    copyContactsToData();
    alert("Sent!");
    console.log(data);
  });
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

function extractContacts() {
  var contacts = "";
  $("a.contact").each(function(index, item, args) {
    contacts += "&c" + index + "=" + $(item).text();
  });
  return contacts;
}

function copyContactsToData() {
  data.contacts = {};
  $("a.contact").each(function(index, item, args) {
    data.contacts[index] = $(item).text();
  });
}