(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$state', 'Auth'];

  function LoginController($state, Auth) {
    var vm = this;
    vm.loading = false;
    
    ////////////////

    vm.auth = function() {
    	console.log('LOGIN', vm.user);
      vm.loading = true;
      Auth.login(vm.user).then(function(res) {
        console.log(res);
          $state.go('dashboard.campaigns');
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.loading = false;
      });
    };

  }

})();
