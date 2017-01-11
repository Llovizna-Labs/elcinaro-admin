(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('RubrosController', Controller);

  Controller.$inject = ['$scope', '$http', '$mdDialog', '$siembras'];

  /* @ngInject */
  function Controller($scope, $http, $mdDialog, $siembras) {
    var vm = this;

    vm.title = 'Rubros';

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Rubros',
      search: {
        placeholder: 'Nombre'
      },
      detail: {
        title: function(data) {
          return 'Rubros: ' + data.join(' ');
        }
      }
    }

    vm.query = {
      order: '-updated',
      limit: 10,
      page: 1,
      filter: ''
    };

    var clientObject = {
      nombre: '',
    }

    var fieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'perm_identity'
    }];


    activate();

    function activate() {
      console.log('RubrosController');
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
      vm.promise = $siembras.getRubros(vm.query)
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
              type: 'rubros',
              handler: isNew ? 'createRubro' : 'updateRubro',
              title: isNew ? 'Registrar Rubro' : 'Actualizar Datos Rubro',
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

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cultivos_count) {
        alertDialog(ev, id);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev, id) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');

        $mdDialog.show(confirm)
          .then(function() {
            return $siembras['deleteRubro'](vm.item[0])
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

      //Cannot delete item, has associates.
      function alertDialog(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Este elemento no puede ser eliminado')
          .textContent('Esta area de siembra posee ' + vm.item[0].cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }


    // $scope.$watch('vm.query.filter', function(current, original) {
    //   if (!current) return;
    //
    //   if (vm.timeout) $timeout.cancel(vm.timeout);
    //
    //   vm.timeout = $timeout(function() {
    //     getData();
    //   }, 500); // delay 500 ms
    // });
    //
    //
    // $scope.$watchCollection('vm.item', function(c, o) {
    //   if (_.isEmpty(c)) return;
    // });
  }
})();
