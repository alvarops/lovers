define([
    'jquery'
], function($) {
    var initialize = function() {
        map = new Map("map", {
            center: [-56.049, 38.485],
            zoom: 3,
            basemap: "streets"
        });

        geoLocate = new LocateButton({
            map: map
        }, "LocateButton");
        geoLocate.startup();

    }

    return {
        initialize: initialize
    };
});
