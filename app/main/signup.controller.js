(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$rootScope', '$mdDialog', 'Auth'];

  function SignupController($rootScope, $mdDialog, Auth) {
    var vm = this;
    vm.data = {};
    vm.loading = false;
    vm.isConfirm = true;
    vm.availability = true;

    ////////////////

    vm.signupAttempt = function() {
      vm.loading = true;
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
        vm.loading = false;
      });
    };

    vm.compare = function() {
      vm.isConfirm = vm.data.confirmPassword == vm.data.password;
    };


    vm.close = function() {
      $mdDialog.cancel();
    };

  }

})();
