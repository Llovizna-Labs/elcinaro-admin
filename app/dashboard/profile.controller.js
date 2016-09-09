(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('ProfileController', Controller);

  Controller.$inject = ['_', '$rootScope', '$q', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', 'UtilService'];

  function Controller(_, $rootScope, $q, uiGmapGoogleMapApi, uiGmapIsReady, UserService, UtilService) {
    var vm = this;
    var PlacesAutocomplete = null;

    vm.countries = UtilService.getCountries();

    vm.data = {
      country: 'CA'
    };
    vm.placesReady = false;

    activate();

    ////////////////
    function activate() {
      console.log('Profile Controller');
      console.log($rootScope.user);
      angular.copy($rootScope.user, vm.data);
      vm.data.country = _.find(vm.countries, function(item) {
        return item.name === $rootScope.user.country || item.id === $rootScope.user.country;
      });

      var indexImage = $rootScope.user.imageGallery.indexOf($rootScope.user.profileImage);

      uiGmapGoogleMapApi.then(function(maps) {
        PlacesAutocomplete = new maps.places.AutocompleteService();
        vm.placesReady = true;
      });


      vm.data.birth = moment($rootScope.user.birth || {}).toDate();
    }

    vm.autocompleteCountry = function(query) {
      return autocompleteCountry(query);
    };

    function autocompleteCountry(query) {
      var results = query ? vm.countries.filter(createFilterFor(query)) : vm.countries;
      return results;
    }

    function createFilterFor(query) {
      var capitalizeQuery = _.capitalize(query);
      return function filterFn(country) {
        return (country.name.indexOf(capitalizeQuery) === 0);
      };
    }


    vm.autocompleteAddress = function(address) {
      var deferred = $q.defer();

      PlacesAutocomplete.getQueryPredictions({
        input: address,
      }, function(data) {
        deferred.resolve(data ? _.filter(_.filter(data, 'place_id'), function(i) {
          return !_.includes(i.types, 'establishment') && !_.includes(i.types, 'country');
        }) : []);
      });

      return deferred.promise;
    };


    vm.updateProfile = function() {
      vm.loading = true;
      vm.data.country = angular.isObject(vm.data.country) ? vm.data.country.id : vm.data.country;

      UserService.update($rootScope.user.id, vm.data).then(function(resp) {
        vm.data = resp;
        vm.error = false;
        vm.data.birth = moment(vm.data.birth).toDate();
      }, function(err) {
        vm.error = true;
      }).finally(function() {
        vm.loading = false;
      });

    };
  }

})();
