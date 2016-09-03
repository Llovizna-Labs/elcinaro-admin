(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['Auth'];

  function LoginController(Auth) {
    var vm = this;
    vm.loading = false;
    ////////////////

    vm.auth = function() {
    	console.log('LOGIN', vm.user);
      Auth.login(vm.user).then(function(res) {
        console.log(res);
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.loading = false;
      });
    };

  }

})();
