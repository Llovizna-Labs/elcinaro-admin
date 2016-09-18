(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SemillasController', Controller);

  Controller.$inject = ['$scope', '$http', '$q', '$timeout', '$siembras'];

  /* @ngInject */
  function Controller($scope, $http, $q, $timeout, $siembras) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];

    vm.table = {
      title: 'Inventario de Semillas',
      search: {
        placeholder: 'Rubro, proovedor, descripcion'
      }
    }
    vm.query = {
      order: 'nivel_germinacion',
      limit: 10,
      page: 1,
      filter: ''
    };

    activate();

    function activate() {
      console.log('Semillas Controller');
      getData();
    }

    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getSemillas(vm.query).then(success);
    };


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });
  }
})();
