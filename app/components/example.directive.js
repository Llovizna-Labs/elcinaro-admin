/**
 * @ngdoc directive
 * @name example
 * @description 
 * 
 * Directiva de ejemplo
 * 
 */
(function() {
  'use strict';

  angular
    .module('devion-stack-angular')
    .directive('example', example);

  example.$inject = ['userService'];

  /* @ngInject */
  function example(userService) {
    var directive = {
      bindToController: true,
      controller: Controller,
      controllerAs: 'vm',
      link: link,
      restrict: 'EA',
      scope: {},
      templateUrl: 'assets/views/example.html'
    };
    return directive;

    function link(scope, element, attrs) {
      console.log('Example directive link');
    }
  }

  /* @ngInject */
  function Controller() {
    var vm = this;

    console.log('Example directive controller');
  }
})();
