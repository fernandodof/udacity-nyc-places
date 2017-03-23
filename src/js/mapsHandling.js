var map;
var markers = [];
var bounds;

//Init map after google api os loaded
function initMap(places) {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13,
        mapTypeControl: false
    });

}

//This Function to init markers after page load
function initMarkers(places) {
    var infoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < places.length; i++) {

        // Create a marker per place, and put into markers array.
        var marker = new google.maps.Marker({
            position: places[i].location,
            title: places[i].title,
            animation: google.maps.Animation.DROP,
            id: places[i].foursquareVenueId
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
            //Call foursquare search
            forsquareSearch(this.id);
            toggleBounceMarker(this);
        });

    }

    showMarkers(markers);
}

// This function will loop through the markers array and display them all.
function showMarkers(markers) {
    bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function refreshMarkers(venueIds) {
    hideMarkers();
    for (var i = 0; i < markers.length; i++) {
        if (venueIds.indexOf(markers[i].id) > -1) {
            markers[i].setVisible(true);
        }
    }
}

//function to hide all markers
function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
}

//Function to get a marker and populate its info window when the marker is clicked
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

//Function to find marker by its id and show forsquare info and call function to animate marker
function highlightMarker(venueId) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id === venueId) {
            forsquareSearch(markers[i].id);
            toggleBounceMarker(markers[i]);
        }
    }
}

//Function to animate a marker passed as a parameter
function toggleBounceMarker(marker) {
    //Do not animate if there is an animation already
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        //show animation for 14000 milisaconds the remove it
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    }
}

//function to show forsquare information based on venueId passed as parameter
function forsquareSearch(venueId) {
    //foursquare url
    var url = 'https://api.foursquare.com/v2/venues/' + venueId;

    //forsquare api params
    var params = {
        v: '20161016',
        client_id: '4Z215TOF2AG0HDNYOVXXJULPIKDUJ5OWSBM1DMOLDWXZBEUU',
        client_secret: '2ENDNLTECXNM2RBPWE200JPO3YIA0GCCGJZXGCW3WUYLJST2',
        locale: 'en'
    };

    //Making an ajax request to forsquare api
    $.get({
        'url': url,
        'data': $.param(params),
    }).done(function(data) {
        var venue = data.response.venue;

        var name = venue.name || 'No name provided';
        var rating = venue.rating || 'No rating provided';
        var address = ((venue.location && venue.location.formattedAddress.length) ? venue.location.formattedAddress.join(', ') : 'No Address provided');
        //Set forsquare info on page
        setForsquareInfo('Name: ' + name, 'Rating: ' + rating, 'Address: ' + address);
    }).fail(function(data) {
        setForsquareError();
    });

}
