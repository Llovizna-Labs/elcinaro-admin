(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ActividadController', Controller);

    Controller.$inject = ['$http', '$q'];

    /* @ngInject */
    function Controller($http, $q) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
