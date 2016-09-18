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
    .module('ElCinaroAdmin')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', 'jQuery', ];

  /* @ngInject */
  function HomeController($rootScope, jQuery) {
    var vm = this;
    vm.title = 'Home Controller';
    vm.scrollTo = scrollTo;
    vm.actividades = [];

    activate();

    ////////////////

    function activate() {
      console.log('HomeController');
    }


    function scrollTo(element) {
      jQuery('html, body').animate({
        scrollTop: jQuery(element).offset().top
      }, 1000);
    }
  }
})();
