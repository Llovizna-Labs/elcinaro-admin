(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('adbDisplayChooser', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.display.html',
      scope: {
        options: '=',
        form: '=',
        total: '='
      },
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  Controller.$inject = ['uiGmapGoogleMapApi',
    'uiGmapIsReady',
    '$q',
    '$scope',
    '$timeout',
    'DropzoneService'
  ];

  /* @ngInject */
  function Controller(uiGmapGoogleMapApi, uiGmapIsReady, $q, $scope, $timeout, DropzoneService) {
    var vm = this;
    var Places = null;
    var DirectionRenderer = null;
    var DirectionsService = null;
    var PlacesAutocomplete = null;
    vm.markerConfirmed = false;
    vm.placesReady = false;

    vm.control = {
      uploading: false
    }
    vm.map = {
      center: {
        latitude: 45.50174502816667,
        longitude: -73.5703881829977
      },
      zoom: 14,
      options: {
        scrollwheel: true
      },
      mapMarker: true,
      disableDefaultUI: true,
      control: {},
      events: {
        click: clickMap,
        idle: boundsChanged
      }
    };

    vm.info = {
      name: '',
      address: '',
      icon: '',
    }

    vm.marker = {
      id: 0,
      location: {
        latitude: 45.50174502816667,
        longitude: -73.5703881829977
      },
      show: false,
    }

    vm.desktopDropzone = DropzoneService.create('desktop', function(file, response) {
      $scope.$apply(function() {
        console.log(response.secure_url);
        vm.form.banner.website = response.secure_url;
        vm.control.uploading = false;
      });
    }, function() {
      $scope.$apply(function() {
        vm.control.uploading = true;
      });
    });

    vm.mobileDropzone = DropzoneService.create('mobile', function(file, response) {
      $scope.$apply(function() {
        console.log(response.secure_url);
        vm.form.banner.app = response.secure_url;
        vm.control.uploading = false;
      });
    }, function() {
      $scope.$apply(function() {
        vm.control.uploading = true;
      });
    });

    activate();

    ////////////////

    function activate() {
      console.log('activate');
      prepareMap();
    }

    vm.clickMarker = function() {
      console.log('click');
      vm.marker.show = !vm.marker.show;
      $scope.$apply();

    }

    vm.autocompleteAddress = function(address) {

      vm.markerConfirmed = false;

      var deferred = $q.defer();

      PlacesAutocomplete.getQueryPredictions({
        input: address
      }, function(data) {
        deferred.resolve(data ? _.filter(data, 'place_id') : []);
      });

      return deferred.promise;
    };

    vm.getPlace = function() {
      console.log(vm.info.place);

      if (!vm.info.place) {
        vm.markerConfirmed = false;
        return;
      };

      Places.getDetails({
        placeId: vm.info.place.place_id
      }, function(place, status) {
        console.log(place, status);

        vm.marker = {
          id: Date.now(),
          address: place.formatted_address,
          name: vm.info.name,
          location: {
            latitude: parseFloat(place.geometry.location.lat()),
            longitude: parseFloat(place.geometry.location.lng()),
          },
          show: true,
          country: _.filter(place.address_components, function (item) {
            return _.includes(item.types, 'country');
          })[0].long_name,
          address_components: place.address_components
        };
        centerMap(vm.map.instance, vm.marker.location, null, true);
        $scope.$apply();
      });
    };

    vm.confirmMarker = function() {
      if (!vm.info.name) return;

      vm.form.marker = {
        id: vm.marker.id,
        address: vm.marker.address,
        name: vm.info.name,
        location: vm.marker.location,
        show: true,
        country: vm.marker.country,
        address_components: vm.marker.address_components
      }
      vm.markerConfirmed = true;
      console.log(vm.form.marker);
    }

    function centerMap(map, location, offset, scroll) {
      console.log(location);
      $timeout(function() {
        map.panTo(new google.maps.LatLng(location.latitude, location.longitude));
        if (offset) map.panBy(0, -200);
      }, 100);
    }

    function clickMap(map, eventName, originalEventArgs) {
      var e = originalEventArgs[0];
      var lat = e.latLng.lat(),
        lon = e.latLng.lng();
      vm.marker = {
        id: Date.now(),
        location: {
          latitude: lat,
          longitude: lon
        },
        show: false
      };
      $scope.$apply();
    }

    function boundsChanged() {
      console.log('bounds changed');
      console.log(vm.placesReady);

      if (!vm.map.instance) {
        prepareMap();
      }
      return;
    }

    function prepareMap() {
      $q.all([uiGmapGoogleMapApi, uiGmapIsReady.promise(1)]).then(function(response) {
        var map = response[0];
        var instance = response[1][0].map;

        vm.window = {
          pixelOffset: new map.Size(0, -40),
          closeClick: function() {
            vm.marker.show = false;
          }
        };

        PlacesAutocomplete = new map.places.AutocompleteService();
        DirectionsService = new map.DirectionsService();
        DirectionRenderer = new map.DirectionsRenderer();
        vm.map.instance = instance;
        DirectionRenderer.setMap(vm.map.instance);
        Places = new map.places.PlacesService(vm.map.instance);
        vm.placesReady = true;
        console.log('ready');
        //getLocation();

      });
    }

    function getLocation() {
      if (vm.data.location) {
        vm.location = {
          lat: parseFloat(vm.data.location[0]),
          lng: parseFloat(vm.data.location[1])
        }
        return;
      }
      //
      // $util.getLocation()
      //   .then(function(location) {
      //     vm.location = location;
      //     //centerMap(vm.map.instance, vm.location);
      //   }).catch(function(err) {
      //     if ($rootScope.user.addressPlace)
      //       getPlace($rootScope.user.addressPlace.place_id);
      //
      //   }).finally(function() {
      //     //vm.mapVisible = true;
      //     //vm.activities.push(locationMarker());
      //     console.log('location');
      //   });
      //
    
    }
  }
})();
