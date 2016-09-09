(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$rootScope', '$mdDialog', '$scope', 'Auth', 'UtilService'];

  function SignupController($rootScope, $mdDialog, $scope, Auth, UtilService) {
    var vm = this;
    vm.data = {
      country: {}
    };

    vm.loading = false;
    vm.isConfirm = true;
    vm.availability = true;
    vm.countries = UtilService.getCountries();

    ////////////////

    activate();


    function activate() {
      console.log('signup controller');
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

    vm.signupAttempt = function() {
      vm.loading = true;
      var country = vm.data.country;
      vm.data.country = country.id;
      Auth.register(vm.data).then(function(res) {
        Auth.setCredentials(res);
        $mdDialog.hide();
      }, function(err) {
        console.log(err);
        vm.error = true;
      }).finally(function() {
        vm.loading = false;
      });
    };


    vm.checkCredentailsAvailability = function(credential) {
      var query = {};
      vm.availability = true;

      if (!vm.data[credential]) return;

      vm.loading = true;
      query[credential] = vm.data[credential];
      Auth.credentialAvaliability(query).then(function(res) {
        vm.availability = res.availability;
        vm.loading = false;
      }, function(err) {
        vm.error = true;
        vm.loading = false;
      });
    };

    vm.compare = function() {
      vm.isConfirm = vm.data.confirmPassword == vm.data.password;
    };


    vm.close = function() {
      $mdDialog.cancel();
    };

    $scope.$watch('vm.data', function(c, o) {
      console.log(c);
    }, true)
  }

})();
