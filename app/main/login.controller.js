(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$state', 'Auth'];

  function LoginController($state, Auth) {
    var vm = this;

    ////////////////

    vm.login = function() {
      Auth.login(vm.user).then(function(res) {
        console.log(res);
        $state.go('dashboard.campaigns');
      });
    };

  }

})();
