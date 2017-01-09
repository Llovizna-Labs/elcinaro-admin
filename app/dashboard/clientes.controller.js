(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ClientesController', Controller);

  Controller.$inject = ['_', '$pedidos', '$mdDialog'];

  /* @ngInject */
  function Controller(_, $pedidos, $mdDialog) {
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

    var fieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'apellido',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'email',
      type: 'text',
      icon: 'email'
    }, {
      name: 'identification',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'telefono',
      type: 'text',
      icon: 'phone'
    }, {
      name: 'direccion',
      type: 'text',
      icon: 'place'
    }];


    var clientObject = {
      nombre: '',
      apellido: '',
      email: '',
      identification: '',
      direccion: '',
      telefono: '',
    }

    activate();


    function activate() {
      console.log('ClientesController');
      getData();
    }


    vm.logItem = function() {
      console.log(vm.item);
    }

    vm.spawnModal = function(ev, isNew) {
      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: {
              type: 'clientes',
              handler: isNew ? 'createCliente' : 'updateCliente',
              title: isNew ? 'Registrar Cliente' :'Actualizar Datos Cliente',
              data: !_.isEmpty(vm.item) ? _.head(vm.item) : clientObject,
              fields: fieldsMeta
            }
          }
        })
        .then(function(answer) {
          console.log(answer);
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev, id) {

      var confirm = $mdDialog.confirm()
        .title('Esta seguro de eliminar esta informacion?')
        .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Eliminar')
        .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(function() {
          return $pedidos['deleteCliente'](id)
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);
            });
        }, function() {
          console.log('cancel');
        });
    }

    function getData() {
      vm.item = [];
      vm.promise = $pedidos.getClientes(vm.query)
        .then(function(resp) {
          vm.data = resp;
        });
    }


  }
})();
