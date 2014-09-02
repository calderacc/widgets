

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