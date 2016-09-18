(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ProfileController', Controller);

  Controller.$inject = ['_', '$rootScope', '$q', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'UserService', '$util'];

  function Controller(_, $rootScope, $q, uiGmapGoogleMapApi, uiGmapIsReady, UserService, $util) {
    var vm = this;
    var PlacesAutocomplete = null;

    vm.countries = $util.getCountries();

    vm.data = {
      country: 'CA',
      username: '',
      birth: new Date()
    };
    vm.placesReady = false;

    activate();

    ////////////////
    function activate() {
      console.log('Profile Controller');
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
