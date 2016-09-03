(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['Auth'];

  function LoginController(Auth) {
    var vm = this;

    ////////////////

    vm.login = function() {
    	console.log('LOGIN', vm.user);
      Auth.login(vm.login).then(function(res) {
        console.log(res);
      });
    };

  }

})();
