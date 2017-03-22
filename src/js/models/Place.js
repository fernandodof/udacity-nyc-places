(function() {
    'use strict';

}());

var Place = function(title, location, foursquareVenueId) {
    this.title = ko.observable(title);
    this.location = ko.observable(location);
    this.foursquareVenueId = ko.observable(foursquareVenueId);
};
