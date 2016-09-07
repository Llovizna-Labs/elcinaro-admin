(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('ProfileController', Controller);

  Controller.$inject = ['$rootScope', '$q', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', 'UtilService'];

  function Controller($rootScope, $q, uiGmapGoogleMapApi, uiGmapIsReady, UserService, UtilService) {
    var vm = this;
    var PlacesAutocomplete = null;

    vm.data = {};
    vm.placesReady = false;
    vm.countries = UtilService.getCountries();

    activate();

    ////////////////
    function activate() {
      console.log($rootScope.user);
      
      var indexImage = $rootScope.user.imageGallery.indexOf($rootScope.user.profileImage);

      uiGmapGoogleMapApi.then(function(maps) {
        PlacesAutocomplete = new maps.places.AutocompleteService();
        vm.placesReady = true;
      });

      angular.copy($rootScope.user, vm.data);

      vm.data.birth = moment($rootScope.user.birth || {}).toDate();
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
      vm.data.country = angular.isObject(vm.data.country) ? vm.data.country.name : vm.data.country;

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
