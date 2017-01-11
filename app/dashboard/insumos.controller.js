(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('InsumosController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$insumos'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $insumos) {
        var vm = this;

        vm.title = 'Insumos';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Insumos',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Insumo: ' + data.join(' ');
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
          name: 'codigo',
          type: 'text',
          icon: 'perm_identity'
        },
        {
          name: 'cantidad',
          type: 'number',
          icon: 'perm_identity'
        },
        {
          name: 'medida',
          type: 'select',
          icon: 'perm_identity',
          placeholder: 'Medida',
          handler: 'getMedidas',
        },
        {
         name: 'proovedor',
         type: 'select',
         icon: 'perm_identity',
         handler: 'getProovedores',
         placeholder: 'Proovedor'
       }];


        activate();

        function activate() {
          console.log('InsumosController');
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
          vm.promise = $insumos.getInsumos(vm.query)
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
                  type: 'insumos',
                  handler: isNew ? 'createInsumos' : 'updateInsumos',
                  title: isNew ? 'Registrar Insumo' : 'Actualizar Datos Insumo',
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
              return $insumos['deleteInsumos'](id)
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
