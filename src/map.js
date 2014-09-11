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

Map.prototype.map = null;
Map.prototype.marker = null;
Map.prototype.tileLayer = null;
Map.prototype.ride = null;

Map.prototype.getOptionValue = function(optionKey)
{
    return this.mapOptions[optionKey];
};

Map.prototype.hasOptionValue = function(optionKey)
{
    return this.mapOptions[optionKey] !== undefined;
};

Map.prototype.loadStylesheets = function()
{
    var head = $('head');

    head.append('<link rel="stylesheet" type="text/css" href="../src/css/map.css" />');
    head.append('<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />');
};

Map.prototype.setMapWidthHeight = function()
{
    var mapContainer = $('#' + this.mapIdentifier);

    mapContainer.width(this.getOptionValue('width'));
    mapContainer.height(this.getOptionValue('height'));
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
            this.processRide(data);
        }
    });
};

Map.prototype.processRide = function(data)
{
    this.createMap();
    this.createTileLayer();

    var rides = data.rides;

    for (var city in rides)
    {
        if (city == this.getOptionValue('citySlug'))
        {
            this.displayRide(rides[city]);
        }
    }
};

Map.prototype.getMapLatLng = function()
{
    var mapLatLng;

    if (this.hasOptionValue('mapCenterLatitude') && this.hasOptionValue('mapCenterLongitude'))
    {
        mapLatLng = L.latLng(this.getOptionValue('mapCenterLatitude'), this.getOptionValue('mapCenterLongitude'));
    }
    else
    {
        mapLatLng = L.latLng(this.ride.latitude, this.ride.longitude);
    }

    return mapLatLng;
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

Map.prototype.createMap = function()
{
    var mapOptions = [];
    mapOptions['zoomControl'] = this.hasOptionValue('zoomControl') ? this.getOptionValue('zoomControl') : true;

    this.map = L.map(this.mapIdentifier, mapOptions);
};

Map.prototype.createTileLayer = function()
{
    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        detectRetina: true
    }).addTo(this.map);
};

Map.prototype.createMarker = function(locationLatLng)
{
    this.marker = L.marker(locationLatLng).addTo(this.map);
};

Map.prototype.createPopup = function(dateTime, location)
{
    var url = 'https://criticalmass.in/' + this.getOptionValue('citySlug');

    var popupContent = '<a href="' + url + '" id="criticalmassin-next-tour-headline">N&auml;chste Tour:</a>';
    popupContent += '<span id="criticalmassin-next-tour-date">Datum: ' + this.formatDate(dateTime) + '</span>';
    popupContent += '<span id="criticalmassin-next-tour-time">Uhrzeit: ' + this.formatTime(dateTime) + '</span>';
    popupContent += '<span id="criticalmassin-next-tour-location">Treffpunkt: ' + location + '</span>';

    this.marker.bindPopup(popupContent);

    if (this.hasOptionValue('showPopup') ? this.getOptionValue('showPopup') : true)
    {
        this.marker.openPopup();
    }
};

Map.prototype.displayRide = function(ride)
{
    this.ride = ride;

    var locationLatLng = L.latLng(this.ride.latitude, this.ride.longitude);
    var mapLatLng = this.getMapLatLng();
    var zoomLevel = this.hasOptionValue('zoomLevel') ? this.getOptionValue('zoomLevel') : 13;

    this.map.setView(mapLatLng, zoomLevel);

    var dateTime = new Date(this.ride.dateTime);

    this.createMarker(locationLatLng);
    this.createPopup(dateTime, this.ride.location);
}