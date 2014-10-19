   var autocompleteData = $.parseJSON('{"count": 5, "next": null, "previous": null, "results": [{"id": 1, "name": "Thomas", "phoneNumber": "353831535892"}, {"id": 2, "name": "Nacho", "phoneNumber": "353834416095"}, {"id": 3, "name": "Enrique", "phoneNumber": "353831584831"}, {"id": 4, "name": "Jose", "phoneNumber": "353831536168"}, {"id": 5, "name": "Alvaro", "phoneNumber": "353860805608"}]}');
   autocompleteData = autocompleteData.results;

   $("#contactsPage").bind("pageshow", function(e) {
            /*$.ajax({
                url: "http://127.0.0.1\:8000/contact",
                dataType: "json",
                crossDomain: true
            })
            .then( function ( response ) {
                $.each( response, function ( i, val ) {
                    console.log(val);
                });
            });*/


       $('#items').sortable();
       $('#items').disableSelection();
       $('#items').on('sortstop', function(event, ui) {
             $('#items').listview('refresh');
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
                 $('#items').append('<a class="contact" href="#" data-icon="flat-cmd" data-id="' + $a.data('autocomplete').id +
                  '" data-role="button">' + $a.data('autocomplete').value  + '</a>');
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
        while (url["c"+index]) {
          var contact = $.grep( autocompleteData, function( item ){
            return (item.id && item.id == url["c"+index]);
          })
          if (contact && contact.length > 0) {
            $('#items').append('<a class="contact" href="#" data-icon="flat-cmd" data-role="button" data-id="' + contact[0].id 
              + '">' + contact[0].name + '</a>');
          }
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
     data.contacts = {};
     $("a.contact").each(function (index, item, args) {
       data.contacts[index] = $(item).attr("data-id");
     });
   }