window.onload = function()
{
    $('#criticalmassin-widget-map-container').append('<div id="criticalmassin-widget-map" style="height: 250px; width: 250px;"></div>');

    var map = L.map('criticalmassin-widget-map');
    map.setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
};