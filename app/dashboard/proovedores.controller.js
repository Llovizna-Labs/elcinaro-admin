(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ProovedoresController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$siembras', '$proovedores'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $siembras, $proovedores) {
        var vm = this;

        vm.title = 'Proovedores';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Proovedores',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Proovedor: ' + data.join(' ');
            }
          }
        }

        //Pdf Configuration
        vm.meta = {
          modulo: 'proveedores',
          title:   'Proveedores',
          subtitle:'Listado de Proveedores',
          fields: ['id', 'nombre', 'direccion', 'telefono']
        };

        vm.query = {
          order: '-updated',
          limit: 10,
          page: 1,
          filter: ''
        };

        var clientObject = {
          nombre: '',
          descripcion: '',
          categoria: '',
          direccion: '',
          telefono: '',
        }

        var fieldsMeta = [{
          name: 'nombre',
          type: 'text',
          icon: 'perm_identity'
        }, {
          name: 'descripcion',
          type: 'text',
          icon: 'perm_identity'
        }, {
          name: 'categoria',
          type: 'select',
          icon: 'perm_identity',
          handler: 'getProovedorCategoria',
          placeholder: 'Categoria'
        }, {
          name: 'telefono',
          type: 'text',
          icon: 'phone'
        }, {
          name: 'direccion',
          type: 'text',
          icon: 'place'
        }];


        activate();

        function activate() {
          console.log('ProovedoresController');
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
          vm.promise = $siembras.getProovedores(vm.query)
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
                  type: 'proovedores',
                  handler: isNew ? 'createProovedor' : 'updateProovedor',
                  title: isNew ? 'Registrar Proovedor' : 'Actualizar Datos Proovedor',
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
              return $proovedores['deleteProovedor'](id)
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
