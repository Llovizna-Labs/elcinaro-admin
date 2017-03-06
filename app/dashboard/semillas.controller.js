(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SemillasController', Controller);

  Controller.$inject = ['_','moment', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$siembras'];

  /* @ngInject */
  function Controller(_, moment, $scope, $http, $q, $timeout, $mdDialog, $siembras) {
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


    vm.form = {
      nivel_germinacion: 0.0,
      cantidad: 0.0,
      precio_compra: 0.0,
      codigo: 'ABCD00',
      fecha_compra: new Date(),
      descripcion: 'Descripción de la semilla'
    }

    vm.meta = {
      searchForm: {},
      fields: [{
        name: 'familia',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getRubros',
        placeholder: 'Seleccione un Rubro',
        repeat: true
      },
      {
        name: 'proovedor',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getProovedores',
        placeholder: 'Seleccione un Proovedor',
        repeat: true
      },
      {
        name: 'unidad',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getUnidades',
        placeholder: 'Unidad',
        repeat: false
      }]
    };


    //Selector
    vm.metaFieldsByname = _.keyBy(vm.meta.fields, 'name')

    //activate();

    function activate() {
      console.log('Semillas Controller');
      getData();

      console.log(vm.metaFieldsByname)
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

    vm.formIsValid = function() {
      return true;
    }


    vm.handleForm = function() {
      console.log(vm.form);

      $siembras['createSemilla'](vm.form)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        });
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
      vm.item['fecha_compra'] = new Date(vm.item[0]['fecha_compra']);
    });

    $scope.$watch('vm.form.fecha_compra', function(c, o) {
      if (_.isEmpty(c)) return;
      vm.form['fecha_compra'] = new Date(c);
    });

    $scope.$watch('vm.currentTab', function(c, o) {
      console.log('current tab', c);
      if (c == o) return;
      if (!c) activate();
    });
  }
})();
