(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SemillasController', Controller);

  Controller.$inject = ['moment', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$siembras'];

  /* @ngInject */
  function Controller(moment, $scope, $http, $q, $timeout, $mdDialog, $siembras) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Inventario de Semillas',
      search: {
        placeholder: 'Rubro, proovedor, descripcion'
      },
      detail: {
        title: function(data) {
          return 'Semilla: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'nivel_germinacion',
      limit: 10,
      page: 1,
      filter: ''
    };


    var fieldsMeta = [{
      name: 'descripcion',
      type: 'text',
      icon: 'description'
    }, {
      name: 'fecha_compra',
      type: 'date',
      icon: 'today',
      placeholder: 'Fecha Compra'
    }, {
      name: 'precio_compra',
      type: 'number',
      icon: 'attach_money'
    }, {
      name: 'cantidad',
      type: 'number',
      icon: 'info'
    }, {
      name: 'unidad',
      type: 'select',
      icon: 'info',
      handler: 'getUnidades',
      placeholder: 'Unidad'
    }, {
      name: 'familia',
      type: 'select',
      icon: 'text_fields',
      handler: 'getRubros',
      placeholder: 'Rubro',
      map: {
        id: 'id',
        name: 'nombre'
      }
    }, {
      name: 'proovedor',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getProovedores',
      placeholder: 'Proovedor'
    }, {
      name: 'nivel_germinacion',
      type: 'text',
      icon: 'info'
    }];


    var clientObject = {
      proovedor: '',
      nivel_germinacion: '',
      familia: '',
      unidad: '',
      cantidad: '',
      precio_compra: '',
      fecha_compra: new Date()
    }


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
      vm.promise = $siembras.getSemillas(vm.query)
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
              type: 'semillas',
              handler: isNew ? 'createSemilla' : 'updateSemilla',
              title: isNew ? 'Registrar Semilla' : 'Actualizar Datos Semilla',
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


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });


    $scope.$watchCollection('vm.item', function(c, o) {
      if (_.isEmpty(c)) return;
      vm.item[0]['fecha_compra'] = new Date(vm.item[0]['fecha_compra']);
    });
  }
})();
