

window.onload = function()
{
    $.ajax({
        type: 'GET',
        async: false,
        url: 'https://criticalmass.in/api/ride/getcurrent',
        cache: false,
        context: this,
        success: function(data)
        {
            var rides = data.rides;

            for (var city in rides)
            {
                if (city == citySlug)
                {
                    var dateTime = new Date(rides[city].dateTime);

                    var formattedDate = (dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate())  + '.' +
                        (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' +
                        (dateTime.getFullYear());

                    var formattedTime = (dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours()) + '.' +
                        (dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes()) + ' Uhr';

                    var textContent = '<strong id="criticalmassin-next-tour-headline">N&auml;chste Tour:</strong>';
                    textContent += '<span id="criticalmassin-next-tour-date"></span>';
                    textContent += '<span id="criticalmassin-next-tour-time"></span>';
                    textContent += '<span id="criticalmassin-next-tour-location"></span>';

                    $('#criticalmassin-widget-text-container').html(textContent);
                }
            }
        }
    });
};