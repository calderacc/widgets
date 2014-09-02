window.onload = function()
{
    $('#criticalmassin-widget-map-container').append('<div id="criticalmassin-widget-map" style="width: ' + width + '; height: ' + height + ';"></div>');

    $.ajax({
        type: 'GET',
        async: false,
        url: 'https://criticalmass.cm/app_dev.php/api/ride/getcurrent',
        cache: false,
        context: this,
        success: function(data)
        {
            var map = L.map('criticalmassin-widget-map');

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
                    var latitude = rides[city].latitude;
                    var longitude = rides[city].longitude;

                    var marker = marker = L.marker([latitude, longitude]).addTo(map);
                    map.setView([latitude, longitude], 13);
                }
            }
        }
    });
};