/**
 * @ngdoc controller
 * @name HomeController
 * @requires $rootScope
 * @description 
 * 
 * Maneja el comportamiento de la vista principal
 * 
 */

(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope'];

  /* @ngInject */
  function HomeController($rootScope) {
    var vm = this;
    vm.title = 'Home Controller';

    activate();

    ////////////////

    function activate() {}
  }
})();
