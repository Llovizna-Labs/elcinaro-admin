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

  HomeController.$inject = ['$rootScope', 'jQuery'];

  /* @ngInject */
  function HomeController($rootScope, jQuery) {
    var vm = this;
    vm.title = 'Home Controller';
    vm.scrollTo = scrollTo;
    activate();

    ////////////////

    function activate() {}

    function scrollTo(element) {
      jQuery('html, body').animate({
        scrollTop: jQuery(element).offset().top
      }, 1000);
    }
  }
})();
