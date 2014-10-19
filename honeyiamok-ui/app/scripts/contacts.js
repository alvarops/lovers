   var autocompleteData = {}, data = {};

   $("#contactsPage").bind("pageinit", function(e) {
        $.ajax({
            url: "http://127.0.0.1\:8000/contact",
            dataType: "json",
            crossDomain: true
        })
        .then( function ( response ) {
            if (response && response.results) {
              autocompleteData = response.results;
            }
        
             $('#items').sortable();
             $('#items').disableSelection();
             $('#items').on('sortstop', function(event, ui) {
                   //$('#items').listview('refresh');
             });

             $("#searchField").autocomplete({
                target: $('#suggestions'),
                source: function (request, response) {
                  var matcher = new RegExp( "" + $.ui.autocomplete.escapeRegex( request ), "i" );
                  response( $.grep( autocompleteData, function( item ){
                      if (matcher.test( item.name ) || matcher.test( item.phoneNumber )) {
                        item.label = item.name + " (" + item.phoneNumber + ")";
                        item.value = item.name;
                        return true;
                      }
                      return false;
                  }) );
                },
                callback: function(e) {
                   var $a = $(e.currentTarget);
                   $('#searchField').val("");
                   $("#searchField").autocomplete('clear');

                   var matcher = new RegExp($a.data('autocomplete').name, "i" );
                   if (!matcher.test($("#items").html())) {
                     $('#items').append('<a class="contact" href="#" data-icon="delete" data-id="' + $a.data('autocomplete').id +
                      '" data-role="button">' + $a.data('autocomplete').value  + '</a>');
                     $('#items').trigger('create');
                     $("a.contact").click(function (index, item, args) {
                       $(this).remove();
                     });
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
            while (url["c"+index]) {
              var contact = $.grep( autocompleteData, function( item ){
                return (item.id && item.id == url["c"+index]);
              });
              if (contact && contact.length > 0) {
                $('#items').append('<a class="contact" href="#" data-icon="delete" data-role="button" data-id="' + contact[0].id 
                  + '">' + contact[0].name + '</a>');
              }
              index++;
            }
            $('#items').trigger('create');

            $("a.contact").click(function (index, item, args) {
               $(this).remove();
             });
          });

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

             if (!data.contacts || data.contacts.length == 0) {
              alert("You have to select at least one contact!");
              return;
             }

             data.username = 'johndoe';
             data.interval = 1;
             data.fromLatLng = 0;
             data.toLatLng = 0;

             $.ajax({
                  url: "http://127.0.0.1\:8000/trip/",
                  dataType: "json",
                  contentType: 'application/json',
                  xhrFields: {
                    withCredentials: true
                  },
                  type: "POST",
                  data: JSON.stringify(data),
                  error: function() {
                    alert('Unable to contact the server!');
                  }
              })
              .then( function ( response ) {
                window.location.href = "finish.html"
              });
          });
       });
   });

   function getUrlVars() {
       var vars = [], hash;
       var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
       for(var i = 0; i < hashes.length; i++) {
           hash = hashes[i].split('=');
           vars[hash[0]] = hash[1];
       }
       return vars;
   }

   function extractContacts() {
     var contacts = "";
     $("a.contact").each(function (index, item, args) {
       contacts += "&c" + index + "=" + $(item).attr("data-id");
     });
     return contacts;
   }

   function copyContactsToData() {
     data.contacts = [];
     $("a.contact").each(function (index, item, args) {
       data.contacts.push(parseInt($(item).attr("data-id")));
     });
   }
