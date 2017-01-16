(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('PlagasController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$plagas'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $plagas) {
        var vm = this;

        vm.title = 'Plagas';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Plagas',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Plaga: ' + data.join(' ');
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
          codigo: '',
          cantidad: '',
          proovedor: '',
          medida: ''
        }

        var fieldsMeta = [{
          name: 'nombre',
          type: 'text',
          icon: 'perm_identity'
        },
        {
          name: 'descripcion',
          type: 'text',
          icon: 'perm_identity'
        }];


        activate();

        function activate() {
          console.log('PlagasController');
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
          vm.promise = $plagas.getPlagas(vm.query)
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
                  type: 'plagas',
                  handler: isNew ? 'createPlagas' : 'updatePlagas',
                  title: isNew ? 'Registrar Plaga' : 'Actualizar Datos Plaga',
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
              return $plagas['deletePlagas'](id)
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
