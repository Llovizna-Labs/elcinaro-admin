(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ClientesController', Controller);

  Controller.$inject = ['$pedidos'];

  /* @ngInject */
  function Controller($pedidos) {
    var vm = this;

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];
    vm.table = {
      title: 'Listado de Clientes',
      search: {
        placeholder: 'Nombre, Apellido, etc..'
      }
    }

    vm.query = {
      order: '',
      limit: 10,
      page: 1,
      filter: ''
    };

    activate();


    function activate() {
      console.log('ClientesController');
      getData();
    }


    function getData() {
      vm.promise = $pedidos.getClientes(vm.query).then(function(resp) {
        vm.data = resp;
      });
    };
  }
})();
