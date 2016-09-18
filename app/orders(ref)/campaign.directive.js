(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('adbOrdersCampaign', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.campaign.html',
      scope: {
        options: '=',
        form: '=',
        total: '=',
        control: '='
      },
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  Controller.$inject = ['$scope', '$q', 'CategoryService', 'uiGmapGoogleMapApi'];

  /* @ngInject */
  function Controller($scope, $q, CategoryService, uiGmapGoogleMapApi) {
    var vm = this;
    var Places = null;
    var PlacesAutocomplete = null;

    vm.interests = [];
    vm.categories = [];
    vm.categoriesReady = false;
    activate();

    ////////////////

    function activate() {
      console.log('campaign directive');

      uiGmapGoogleMapApi.then(function(maps) {
        console.log(maps);
        PlacesAutocomplete = new maps.places.AutocompleteService();
        vm.placesReady = true;
      });
    }


    function getCategories() {
      vm.loading = true;
      CategoryService.getCategories('all', {
        all: true,
        official: true,
        country: vm.form.country
      }).then(function(res) {
        vm.categories = res;
      }).finally(function() {
        vm.loading = false;
      });
    }

    vm.autocompleteCities = function(address) {
      var deferred = $q.defer();

      PlacesAutocomplete.getQueryPredictions({
        input: address,
      }, function(data) {
        deferred.resolve(data ? _.filter(_.filter(data, 'place_id'), function(i) {
          return _.includes(i.types, 'locality') || _.includes(i.types, 'administrative_area_level_3');
        }) : []);
      });

      return deferred.promise;
    };

    vm.autocompleteStates = function(address) {
      var deferred = $q.defer();

      PlacesAutocomplete.getQueryPredictions({
        input: address,
      }, function(data) {
        deferred.resolve(data ? _.filter(_.filter(data, 'place_id'), function(i) {
          return _.includes(i.types, 'administrative_area_level_1') || _.includes(i.types, 'administrative_area_level_2');
        }) : []);
      });

      return deferred.promise;
    };

    vm.autocompleteCountries = function(address) {
      var deferred = $q.defer();

      PlacesAutocomplete.getQueryPredictions({
        input: address,
      }, function(data) {
        deferred.resolve(data ? _.filter(_.filter(data, 'place_id'), function(i) {
          return _.includes(i.types, 'country');
        }) : []);
      });

      return deferred.promise;
    };


    $scope.$watch('vm.control.selectedTab', function(c, o) {
      if (!vm.categoriesReady && c === 2) getCategories();
    }, true);

  }
})();
