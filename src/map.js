Map = function(mapIdentifier, mapOptions)
{
    this.mapIdentifier = mapIdentifier;
    this.mapOptions = mapOptions;

    this.setMapWidthHeight();
    this.loadRide();
};

Map.prototype.mapIdentifier = null;
Map.prototype.mapOptions = null;

Map.prototype.map = null;
Map.prototype.marker = null;
Map.prototype.tileLayer = null;
Map.prototype.ride = null;

/**
 * Liefert anhand des übergebenen Schlüssels einen Wert aus den vom Anwender
 * festgelegten Optionen zurück, die in mapOptions gespeichert sind.
 *
 * @param String optionKey Schlüssel zur Identifikation des gesuchten Wertes
 * @returns String Wert der gesuchten Option
 */
Map.prototype.getOptionValue = function(optionKey)
{
    return this.mapOptions[optionKey];
};

/**
 * Gibt anhand des gesuchten Schlüssels zurück, ob der Anwender des Widgets
 * einen bestimmten Wert in den Optionen vereinbart hat.
 *
 * @param String optionKey Schlüssel zur Identifikation des gesuchten Wertes
 * @returns Boolean true, falls der Schlüssel gefunden wurde
 */
Map.prototype.hasOptionValue = function(optionKey)
{
    return this.mapOptions[optionKey] !== undefined;
};

/**
 * Legt anhand der vom Anwender festgelegten Optionen die Breite und Höhe des
 * Karten-Containers fest.
 */
Map.prototype.setMapWidthHeight = function()
{
    var mapContainer = $('#' + this.mapIdentifier);

    mapContainer.width(this.getOptionValue('width'));
    mapContainer.height(this.getOptionValue('height'));
};

/**
 * Führt eine AJAX-Anfrage aus, um die Daten der aktuellen Touren vom Server zu
 * laden. Anschließend wird processRide() aufgerufen.
 *
 * @todo Hier wird noch die alte API-Schnittstelle befragt. In Kürze wird es
 * ein Update geben, das einen anderen Endpunkt anbietet, an dem tatsächlich
 * nur die benötigten Daten ausgeliefert werden.
 */
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

/**
 * Fährt mit der Anzeige der Karte fort. Zuerst wird eine Karte erstellt, dann
 * ein TileLayer hinzugefügt, schließlich wird aus dem ganzen Wust der AJAX-
 * Antwort die gesuchte Tour herausgesucht.
 *
 * @param Object data AJAX-Antwort der API
 */
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

/**
 * Berechnet den Mittelpunkt der Karte. Der Anwender kann optional einen
 * eigenen Kartenmittelpunkt angeben, um die Darstellung in bestimmten Städten
 * zu optimieren. Falls er keinen eigenen Mittelpunkt angegeben hat, wird der
 * Startpunkt der nächsten Tour genutzt.
 *
 * @returns L.latLng mit den berechneten Koordinaten
 */
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

/**
 * Formatiert die Zeit-Angabe vernünftig.
 *
 * @param DateTime dateTime Zu formatierende Zeit-Angabe
 * @returns String Formatierte Zeit-Angabe
 */
Map.prototype.formatTime = function(dateTime)
{
    return (dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()) + '.' +
        (dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()) + ' Uhr';
};

/**
 * Formatiert die Datums-Angabe vernünftig.
 *
 * @param DateTime dateTime Zu formatierende Datums-Angabe
 * @returns String Formatierte Datums-Angabe
 */
Map.prototype.formatDate = function(dateTime)
{
    return (dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate())  + '.' +
        (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' +
        (dateTime.getFullYear());
};

/**
 * Endlich passiert mal wieder was. In dieser Funktion wird die Leaflet-Karte
 * erstellt, die hier einem Container zugeordnet wird. Aus den Optionen wird
 * außerdem herausgelesen, ob ein ZoomControl angezeigt werden soll.
 */
Map.prototype.createMap = function()
{
    var mapOptions = [];
    mapOptions['zoomControl'] = this.hasOptionValue('zoomControl') ? this.getOptionValue('zoomControl') : true;

    this.map = L.map(this.mapIdentifier, mapOptions);
};

/**
 * Erzeugt einen TileLayer und fügt ihn der Karte hinzu.
 */
Map.prototype.createTileLayer = function()
{
    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        detectRetina: true
    }).addTo(this.map);
};

/**
 * Erstellt den Marker für den Treffpunkt
 * @param locationLatLng
 */
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