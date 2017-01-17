(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('LotesController', Controller);

  Controller.$inject = ['_', '$scope', '$http', '$q', '$timeout', '$siembras', '$stateParams', '$mdDialog'];

  /* @ngInject */
  function Controller(_, $scope, $http, $q, $timeout, $siembras, $stateParams, $mdDialog) {
    var vm = this;
    vm.detail = $stateParams.id ? true : false;

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];
    vm.table = {
      title: 'Listado',
      search: {
        placeholder: 'Rubro, Semilla'
      },
      detail: {
        title: function(data) {
          return 'Lote Siembra: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: '-fecha_enviado',
      limit: 10,
      page: 1,
      filter: ''
    };

    var clientObject = {
      fecha_enviado: new Date(),
      fecha_recibido: new Date(),
      cantidad_semillas_enviadas: 0,
      cantidad_semillas_recibidas: 0,
      semilla_utilizada: null,
      germinado: true
    }

    var fieldsMeta = [{
      placeholder: 'Fecha Enviado',
      name: 'fecha_enviado',
      type: 'date',
    }, {
      placeholder: 'Fecha Recibido',
      name: 'fecha_recibido',
      type: 'date',
    }, {
      name: 'cantidad_semillas_enviadas',
      type: 'number',
      icon: 'perm_identity',
      placeholder: 'Cantidad Semillas Enviadas'
    }, {
      name: 'cantidad_semillas_recibidas',
      type: 'number',
      icon: 'perm_identity',
      placeholder: 'Cantidad Semillas Recibidas'
    }, {
      name: 'semilla_utilizada',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getSemillas',
      placeholder: 'Semilla'
    }, {
      name: 'proovedor',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getProovedores',
      placeholder: 'Proovedor'
    }, {
      name: 'germinado',
      type: 'switch',
      placeholder: 'Germinado'
    }];

    vm.meta = {
      fields: fieldsMeta,
      title: 'Lotes de Siembra',
      subtitle: 'Datos de Lote Siembra',
      handlers: [{
        title: 'Agregar',
        submitButton: 'Registrar',
        handler: 'createLoteSiembra'
      }, {
        title: 'Detalle',
        submitButton: 'Actualizar',
        handler: 'updateLoteSiembra'
      }],
      validate: validateFunc,
      handler: handleForm
    };

    vm.currentTab = 0;

    vm.tabOptions = [{
      title: 'Agregar',
      submitButton: 'Registrar',
      handler: 'createLoteSiembra'
    }, {
      title: 'Detalle',
      submitButton: 'Actualizar',
      handler: 'updateLoteSiembra'
    }];

    vm.form = {
      fecha_enviado: new Date(),
      fecha_recibido: new Date(),
      germinado: true,
      cantidad_semillas_recibidas: 0,
      cantidad_semillas_enviadas: 0
    }

    activate();

    function activate() {
      console.log('Cultivos Controller');
      vm.detail ? getItem() : getData();
      vm.detailTab = !vm.detail ? vm.tabOptions[0] : vm.tabOptions[1];
    }


    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    vm.logItem = function() {
      console.log(vm.item);
    }

    vm.switchTab = function() {
      console.log('switching tab', vm.item);
      vm.currentTab = 1;
      var data = _.head(vm.item);
      vm.detailTab = vm.tabOptions[1];
      data.semilla_utilizada = {
        id: data.lote_semilla.id,
        nombre: data.lote_semilla.nombre
      };

      angular.copy(data, vm.form);
    }


    function handleForm(meta, form) {

      form['fecha_enviado'] = moment(form['fecha_enviado'])
        .format('YYYY-MM-DD');

      form['fecha_recibido'] = moment(form['fecha_enviado'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(form, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD')
          .isValid() ? o.id : o;
      });


      $siembras[meta.handler](query)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    vm.spawnModal = function(ev, isNew) {
      console.log(isNew);
    }

    vm.spawnDeleteModal = function(ev) {

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cultivos_count) {
        alertDialog(ev);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            return $siembras['deleteLoteSiembra'](vm.item[0])
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
          .textContent('Este Lote de siembra posee ' + vm.item[0].cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getLotes(vm.query)
        .then(success);
    };

    function validateFunc() {
      return true;
    }

    function getItem() {
      if (!vm.item) {
        console.log('have to get item');
        return;
      } else {
        vm.item = _.filter($siembras.cultivos, function(item) {
          return item.id === parseInt($stateParams.id);
        });
      }
    }


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });

    $scope.$watchCollection('vm.item', function(current, original) {
      if (!current) return;
    });

    $scope.$watch('vm.currentTab', function(c, o) {
      vm.detailTab = !vm.form.hasOwnProperty('id') ? vm.tabOptions[0] : vm.tabOptions[1];

      if (!c) {
        vm.form = {
          fecha_enviado: new Date(),
          fecha_recibido: new Date(),
          germinado: true,
          cantidad_semillas_recibidas: 0,
          cantidad_semillas_enviadas: 0
        }
      }
    })
  }
})();
