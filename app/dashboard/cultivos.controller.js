(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('CultivosController', Controller);

  Controller.$inject = ['_', '$scope', '$http', '$q', '$timeout', '$siembras', '$stateParams'];

  /* @ngInject */
  function Controller(_, $scope, $http, $q, $timeout, $siembras, $stateParams) {
    var vm = this;
    vm.detail = $stateParams.id ? true : false;

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];
    vm.table = {
      title: 'Listado de Cultivos',
      search: {
        placeholder: 'Rubro, Semilla'
      }
    }
    vm.query = {
      order: 'lote__id',
      limit: 10,
      page: 1,
      filter: ''
    };

    activate();

    function activate() {
      console.log('Cultivos Controller');
      vm.detail ? getItem() : getData();
    }

    function getItem() {
      if (!vm.item) {
        console.log('have to get item');
        return;
      } else {
        vm.item = _.filter($siembras.cultivos, function(item) {
          return item.id === parseInt($stateParams.id);
        });
      }
    }

    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    vm.logItem = function() {
      console.log(vm.item);
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getCultivos(vm.query).then(success);
    };

    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });

    $scope.$watchCollection('vm.item', function(current, original) {
      if (!current) return;
      console.log(current);
    });
  }
})();
