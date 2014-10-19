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


var map;
var token = "";
var routeTask;
var routeParams;


require([
    "esri/map", "esri/tasks/locator", "esri/SpatialReference",
    "esri/tasks/RouteTask", "esri/tasks/RouteResult", "esri/tasks/RouteParameters",
    "esri/tasks/FeatureSet", "esri/units", "esri/config", "esri/lang",
    "esri/symbols/PictureMarkerSymbol", "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/urlUtils", "dojo/parser",
    "esri/IdentityManager",
    "dojo/promise/all", "dojo/_base/array", "esri/Color",
    "dojo/dom", "dojo/dom-construct", "dojo/on", "dojo/number",
    "dgrid/Grid", "dojo/domReady!"
], function(
    Map, Locator, SpatialReference,
    RouteTask, RouteResult, RouteParameters,
    FeatureSet, esriUnits, esriConfig, esriLang,
    PictureMarkerSymbol, Graphic, SimpleMarkerSymbol,
    SimpleLineSymbol,
    urlUtils, parser, IdentityManager,
    all, arrayUtils, Color,
    dom, domConstruct, on, number,
    Grid
) {
    parser.parse();
    var locator, segmentGraphic, directionFeatures, grid;
    var first = true;
    var fromPoint, toPoint;
    var fromSymbol = new PictureMarkerSymbol({
        "angle": 0,
        "xoffset": 0,
        "yoffset": 10,
        "type": "esriPMS",
        "url": "http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png",
        "contentType": "image/png",
        "width": 24,
        "height": 24
    });
    var toSymbol = new PictureMarkerSymbol({
        "angle": 0,
        "xoffset": 0,
        "yoffset": 12,
        "type": "esriPMS",
        "url": "http://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png",
        "contentType": "image/png",
        "width": 24,
        "height": 24
    });
    on(dom.byId("directions"), "click", getDirections);
    routeTask = new RouteTask("http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");

    routeParams = new RouteParameters();
    routeParams.stops = new FeatureSet();
    routeParams.returnRoutes = true;
    routeParams.returnDirections = true;

    routeParams.directionsLengthUnits = esriUnits.MILES;
    routeParams.outSpatialReference = new SpatialReference({
        wkid: 102100
    });

    // Use a proxy to access the routing service, which requires credits
    // urlUtils.addProxyRule({
    //   urlPrefix : "route.arcgis.com",
    //   proxyUrl : "/sproxy"
    // });

    //Create a map with an initial extent. Change the extent to match the area you would like to show.
    map = new Map("map", {
        basemap: "streets",
        center: [-117.185, 34.065],
        zoom: 13
    });
    map.on("click", mapClicked);

    //Add a geocoding server as the locator. This locator will be used to find the origin and destination coordinates by input addresses.
    locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.outSpatialReference = map.spatialReference;

    //Fire errorHandler if the locator return en error.
    locator.on("error", errorHandler);
    url = "https://www.arcgis.com/sharing/oauth2/token?client_id=0LJAis2QiQCmounR&grant_type=client_credentials&client_secret=e892cf4b205b440c8fb07a39ff254a36&f=pjson";
    success = function(data, status, obj) {
        token = data.access_token;
        // $.ajaxSetup({
        //   data: {
        //   token:token
        //   },
        //   dataType: "jsonp"
        //   });

        routeParams.token = token;
    };
    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: success
    });


    var secondAdded = false;

    function routesReceived(data, status, obj) {
        showRoute(data);
    }

    function mapClicked(evt) {
        geometries = [];
        // map.graphics.clear();

        // add a simple marker graphic at the location where the user clicked on the map.
        var pointSymbol = first ? fromSymbol : toSymbol;

        if (first) {
            first = false;
            fromPoint = evt.mapPoint;
        } else {
            toPoint = evt.mapPoint;
            secondAdded = true;
        }
        // new SimpleMarkerSymbol(
        //   SimpleMarkerSymbol.STYLE_CROSS, 22,
        //   new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 0]), 4));

        var clickPointGraphic = new Graphic(evt.mapPoint, pointSymbol);

        map.graphics.add(clickPointGraphic);
        if (secondAdded) {
            // var url = "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve";
            // var data = {
            //   "token":token,
            //   stops:[fromPoint,toPoint],
            //   populate_route_edges:true,
            //   outSpatialReference :new SpatialReference({ wkid:102100 }),
            //   directionsLengthUnits : esriUnits.MILES,
            //   isWebMercator:true,
            //   f:"json"
            // };
            //Add a network analyst server with related parameters to execute the routing task.
            // routeParams.stops.features.push(fromPoint);
            // routeParams.stops.features.push(toPoint);

            // routeParams.token = token;

            //Show the route when the routing task is solved successfully, otherwise fire errorHandler.
            // routeTask.on("solve-complete", showRoute);
            // routeTask.on("error", errorHandler);
            // routeTask.solve(routeParams);
            url = "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?stops=116.39722919900055%2C39.90749657700047%3B121.45805638600052%2C31.22221723400048&f=json&token=" + token;

            $.ajax({
                dataType: "json",
                url: url,
                data: null,
                method: "GET",
                success: routesReceived
            });

        }
        // use promise/all to monitor when place search and drive time calculation finish
        // all({
        //   poiSearch: executeLocalSearch(clickPointGraphic),
        //   driveTimes: getDriveTimePolygon(clickPointGraphic)
        // }).then(relateGeometries);
    }


    //Execute a routing task when clicking "get direction".
    function getDirections() {
        routeParams.stops.features = [];
        map.graphics.clear();

        //Get origin address.
        var optionsFrom = {
            address: {
                "SingleLine": dom.byId("fromTxf").value
            },
            outFields: ["Loc_name"]
        };
        var fromAddress = locator.addressToLocations(optionsFrom);

        //Get destination address.
        var optionsTo = {
            address: {
                "SingleLine": dom.byId("toTxf").value
            },
            outFields: ["Loc_name"]
        };
        var toAddress = locator.addressToLocations(optionsTo);

        //Use dojo/promises/all to manage multiple asynchronous tasks. Once both geocodes finish, a route is calculated.
        //http://livedocs.dojotoolkit.org/dojo/promise/all
        all({
            from: fromAddress,
            to: toAddress
        }).then(configureRoute);
    }

    //Check if the origin and destination addresses are executed successfully
    //and solve the routing task.
    function configureRoute(results) {
        //Configure symbols to be used for destinations and route segments.


        var fromStop = getCandidate(results.from);
        if (fromStop === null) {
            errorHandler("The origin address is invalid");
        } else {
            var fromGraphic = new Graphic(fromStop.location, fromSymbol, {
                address: fromStop.address
            });
            routeParams.stops.features[0] = map.graphics.add(fromGraphic);
        }

        var toStop = getCandidate(results.to);
        if (toStop === null) {
            errorHandler("The destination address is invalid");
        } else {
            var toGraphic = new Graphic(toStop.location, toSymbol, {
                address: toStop.address
            });
            routeParams.stops.features[1] = map.graphics.add(toGraphic);
        }

        if (fromStop !== null && toStop !== null) {
            //Show the route when the routing task is solved successfully, otherwise fire errorHandler.
            routeTask.on("solve-complete", showRoute);
            routeTask.on("error", errorHandler);

            routeParams.token = token;

            routeTask.solve(routeParams);
        }
    }

    //Handle all the coordinate candidates of the origin and destination addresses and
    //return the candidate with the highest score.
    function getCandidate(candidates) {
        var stop = null,
            score = 0;
        arrayUtils.forEach(candidates, function(candidate) {
            if (candidate.score > score) {
                stop = candidate;
                score = candidate.score;
            }
        });
        return stop;
    }

    //Show the result of the routing task.
    function showRoute(e) {
        var data = [];
        if (grid) {
            grid.refresh();
        }
        // var e = new RouteResult(res);
        var directions = e.result.routeResults[0].directions;
        directionFeatures = directions.features;
        var routeSymbol = new SimpleLineSymbol().setColor(new Color([0, 0, 255, 0.5])).setWidth(4);

        // Zoom to results.
        map.setExtent(directions.mergedGeometry.getExtent(), true);
        // Add route to the map.
        var routeGraphic = new Graphic(directions.mergedGeometry, routeSymbol);
        map.graphics.add(routeGraphic);
        routeGraphic.getShape().moveToBack();
        map.setExtent(directions.extent, true);

        //Display the directions.
        var directionsInfo = directions.features;
        var totalDistance = number.format(directions.totalLength);
        var totalLength = number.format(directions.totalTime);
        data = arrayUtils.map(directionsInfo, function(feature, index) {
            return {
                "detail": feature.attributes.text,
                "distance": number.format(feature.attributes.length, {
                    places: 2
                }),
                "index": index
            };
        });
        grid = new Grid({
            renderRow: renderList,
            showHeader: false
        }, "grid");
        grid.renderArray(data);
        grid.on(".dgrid-row:click", zoomToSegment);
    }

    function renderList(obj, options) {
            var template = "<div class='detail'><div style='max-width:70%;float:left;'>${detail}</div><span style='float:right;' class='distance'>${distance} mi</span></div>";
            return domConstruct.create("div", {
                innerHTML: esriLang.substitute(obj, template)
            });
        }
        //Display any errors that were caught when attempting to solve the route.
    function errorHandler(err) {
        alert("An error occured\n" + err);
    }

    function zoomToSegment(e) {
        //Grid row id corresponds to the segment to highlight
        var index = grid.row(e).id;
        var segment = directionFeatures[index];
        var segmentSymbol = new SimpleLineSymbol().setColor(new Color([255, 0, 0, 0.5])).setWidth(8);

        map.setExtent(segment.geometry.getExtent(), true);
        if (!segmentGraphic) {
            segmentGraphic = map.graphics.add(new Graphic(segment.geometry, segmentSymbol));
        } else {
            segmentGraphic.setGeometry(segment.geometry);
        }
    }
});
