(function() {
    'use strict';

    //initialize all places
    ko.applyBindings(new LocationViewModel([{
        title: 'Blue Hill',
        foursquareVenueId: '3fd66200f964a52078e31ee3',
        location: {
            lat: 40.7304644,
            lng: -74.0467058
        },
    }, {
        title: 'Gramercy Tavern',
        foursquareVenueId: '3fd66200f964a520aee91ee3',
        location: {
            lat: 40.7431166,
            lng: -74.0231841
        }
    }, {
        title: 'Le Bernardin',
        foursquareVenueId: '3fd66200f964a52066e31ee3',
        location: {
            lat: 40.7644084,
            lng: -74.0350219
        }
    }, {
        title: 'Russ & Daughters Cafe',
        foursquareVenueId: '5244bd0e11d2d511de3e244e',
        location: {
            lat: 40.7243353,
            lng: -73.9910563
        }
    }, {
        title: 'Per Se',
        foursquareVenueId: '41f19780f964a520101f1fe3',
        location: {
            lat: 40.774185,
            lng: -73.9832045
        }
    }, {
        title: 'Eleven Madison Park,',
        foursquareVenueId: '457ebeaaf964a5203f3f1fe3',
        location: {
            lat: 40.746647,
            lng: -74.0572129
        }
    }]));

}());
