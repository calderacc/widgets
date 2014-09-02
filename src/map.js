Map = function(mapIdentifier, mapOptions)
{
    this.mapIdentifier = mapIdentifier;
    this.mapOptions = mapOptions;

    this.loadStylesheets();
    this.setMapWidthHeight();
    this.loadRide();
};

Map.prototype.mapIdentifier = null;
Map.prototype.mapOptions = null;

Map.prototype.loadStylesheets = function()
{
    $('head').append('<link rel="stylesheet" type="text/css" href="../src/css/map.css" />');
    $('head').append('<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />');
};

Map.prototype.setMapWidthHeight = function()
{
    var mapContainer = $('#' + this.mapIdentifier);

    mapContainer.width(width);
    mapContainer.height(height);
};

Map.prototype.loadRide = function()
{
    $.ajax({
        type: 'GET',
        async: false,
        url: 'https://criticalmass.in/api/ride/getcurrent',
        cache: false,
        context: this,
        success: function(data)
        {
            this.displayRide(data);
        }
    });
};

Map.prototype.displayRide = function(data)
{
    var map = L.map(this.mapIdentifier, { zoomControl: zoomControl });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        detectRetina: true
    }).addTo(map);

    var rides = data.rides;

    for (var city in rides)
    {
        if (city == citySlug)
        {
            var url = 'https://criticalmass.in/' + citySlug;

            if (window.mapCenterLatitude !== undefined && window.mapCenterLongitude !== undefined)
            {
                var mapCenter = L.latLng(mapCenterLatitude, mapCenterLongitude);
            }
            else
            {
                var mapCenter = L.latLng(rides[city].latitude, rides[city].longitude);
            }

            var locationLatLng = L.latLng(rides[city].latitude, rides[city].longitude);

            var marker = marker = L.marker(locationLatLng).addTo(map);

            map.setView(mapCenter, zoomLevel);

            var dateTime = new Date(rides[city].dateTime);

            var popupContent = '<a href="' + url + '" id="criticalmassin-next-tour-headline">N&auml;chste Tour:</a>';
            popupContent += '<span id="criticalmassin-next-tour-date">Datum: ' + this.formatDate(dateTime) + '</span>';
            popupContent += '<span id="criticalmassin-next-tour-time">Uhrzeit: ' + this.formatTime(dateTime) + '</span>';
            popupContent += '<span id="criticalmassin-next-tour-location">Treffpunkt: ' + rides[city].location + '</span>';

            marker.bindPopup(popupContent);

            if (showPopup)
            {
                marker.openPopup();
            }
        }
    }
};

Map.prototype.formatTime = function(dateTime)
{
    return (dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()) + '.' +
        (dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()) + ' Uhr';
};

Map.prototype.formatDate = function(dateTime)
{
    return (dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate())  + '.' +
        (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' +
        (dateTime.getFullYear());
};