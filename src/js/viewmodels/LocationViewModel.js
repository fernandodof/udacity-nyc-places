var LocationViewModel = function(places) {
    var self = this;

    self.filter = ko.observable('');

    self.error = ko.observable('');

    self.places = ko.observableArray(ko.utils.arrayMap(places, function(place) {
        return new Place(place.title, place.location, place.foursquareVenueId);
    }));

    self.sidebarActive = ko.observable(false);

    self.foursquareName = ko.observable('');
    self.foursquareRating = ko.observable('');
    self.foursquareAddress = ko.observable('');
    self.foursquareError = ko.observable('');

    var filteredVenueIds = [];

    //Filter places based on search
    self.filteredPlaces = ko.computed(function() {
        filteredVenueIds = [];
        return self.places().filter(function(place) {
            if (place.title.toLowerCase().indexOf(self.filter().toLowerCase()) > -1) {
                filteredVenueIds.push(place.foursquareVenueId);
                return place;
            }
        });
    });

    //Called from view when an item of the list is clicked
    self.showPlaceDetails = function(place) {
        resetfoursquareInfo();
        highlightMarker(place.foursquareVenueId);
    };

    self.filter.subscribe(function() {
        refreshMarkers(filteredVenueIds);
        resetfoursquareInfo();
    });

    self.toggleMenu = function() {
        self.sidebarActive(!self.sidebarActive());
    }

    window.setForsquareInfo = function(name, rating, address) {
        self.foursquareName(name);
        self.foursquareRating(rating);
        self.foursquareAddress(address);
    };

    window.setForsquareError = function(name, rating, address) {
        self.foursquareError('Unable to get foursquare information');
    };

    window.resetfoursquareInfo = function() {
        self.foursquareName('');
        self.foursquareRating('');
        self.foursquareAddress('');
        self.foursquareError('');
    };

    window.mapError = function() {
        self.error('It was not possible to load the google maps api');
    };

    var tries = 0;
    var interval = setInterval(function() {
        tries++;
        if (typeof google !== 'undefined') {
            initMarkers(self.filteredPlaces(), true);
            clearInterval(interval);
        }

        if (tries > 400) {
            self.error('It was not possible to load the google maps api');
            clearInterval(interval);
        }
    }, 5);


};
