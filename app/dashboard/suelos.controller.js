(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
          .controller('SuelosController', Controller);

    Controller.$inject = ['$http', '$q'];

    /* @ngInject */
    function Controller($http, $q) {
        var vm = this;

        activate();

        function activate() {
          console.log('Suelos Controller');
        }
    }
})();
