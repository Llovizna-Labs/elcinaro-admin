(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ActionController', Controller);

    Controller.$inject = ['_', '$scope', '$http', '$q', '$mdDialog',  '$util', '$insumos'];

    /* @ngInject */
    function Controller(_, $scope, $http, $q, $mdDialog, $util, $insumos) {
        var vm = this;

        vm.item = {};
        vm.data = {};
        vm.insumos = $insumos.insumos;
        vm.medidas = $util.getMedidas();
        activate();

        function activate() {
          console.log('action controller');
          angular.copy($util.item, vm.item);
        }

        vm.close = function() {
          vm.item.touched = true;
          $mdDialog.hide(vm.data);
        }

        vm.response = function() {
          vm.item.touched = true;
          $mdDialog.hide(vm.data);
        }

        vm.title = function() {
          return _.join([_.capitalize(vm.item.selector), vm.item.cultivo.description],': ');
        }
    }
})();
