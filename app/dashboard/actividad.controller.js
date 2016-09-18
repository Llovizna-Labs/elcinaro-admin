(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ActividadController', Controller);

  Controller.$inject = ['$http', '$q', '$scope','$siembras'];

  /* @ngInject */
  function Controller($http, $q, $scope, $siembras) {
    var vm = this;

    vm.listReady = false;
    vm.list = [];

    vm.categories = [];
    vm.query = {
      page: 1,
      limit: 100,
      order: '',
      filter: ''
    }

    vm.data = {
      cultivos: {},
      rubros: []
    }

    vm.map = {
      name: 'nombre',
      image: '',
    };


    activate();

    function activate() {
      console.log('Actividad Controller');
      getData();
    }

    function getData() {
      $siembras.getRubros(vm.query).then(function(resp) {
        vm.categories = resp.results;
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.listReady = true;
        console.log(vm.categories);
      })
    }
    vm.cancel = function() {
      $mdDialog.$hide();
    }

    $scope.$watch('vm.categories', function (c,o) {
      console.log(c);
    })
  }
})();
