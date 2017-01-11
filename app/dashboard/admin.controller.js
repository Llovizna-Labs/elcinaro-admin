(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('AdminController', Controller);

  Controller.$inject = ['moment', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$admin', '$pedidos'];

  /* @ngInject */
  function Controller(moment, $scope, $http, $q, $timeout, $mdDialog, $admin, $pedidos) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Usuarios',
      search: {
        placeholder: 'nombre, apellido'
      },
      detail: {
        title: function(data) {
          return 'Usuario: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'id',
      limit: 10,
      page: 1,
      filter: ''
    };


    var fieldsMeta = [{
      name: 'first_name',
      type: 'text',
      icon: 'info'
    }, {
      name: 'last_name',
      type: 'text',
      icon: 'info'
    }, {
      name: 'username',
      type: 'text',
      icon: 'info'
    }, {
      name: 'email',
      type: 'email',
      icon: 'email'
    }, {
      name: 'password',
      type: 'password',
      icon: 'info'
    }, {
      name: 'confirm_password',
      type: 'password',
      icon: 'info'
    }];


    var clientObject = {
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      is_staff: true,
      email: '',
    }


    activate();

    function activate() {
      console.log('Admin  Controller');
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
      vm.item = [];
      vm.promise = $admin.getUsers(vm.query)
        .then(success);
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
              type: 'admin',
              handler: isNew ? 'createUser' : 'updateUser',
              title: isNew ? 'Registrar Usuario' : 'Actualizar Datos Usuario',
              data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                return i.hasOwnProperty('id') ? i.id : i;
              }) : clientObject,
              fields: fieldsMeta,
              options: {

              }
            }
          }
        })
        .then(function(answer) {
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
          return $admin['deleteUsers'](id)
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


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });


    $scope.$watchCollection('vm.item', function(c, o) {
      if (_.isEmpty(c)) return;
    });
  }
})();
