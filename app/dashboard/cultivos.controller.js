(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('CultivosController', Controller);

  Controller.$inject = ['_', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$mdBottomSheet', '$mdToast', '$siembras', '$stateParams'];

  /* @ngInject */
  function Controller(_, $scope, $http, $q, $timeout, $mdDialog, $mdBottomSheet,  $mdToast, $siembras, $stateParams) {
    var vm = this;
    vm.detail = $stateParams.id ? true : false;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];

    vm.currentTab = 0;

    vm.table = {
      title: 'Listado de Cultivos',
      search: {
        placeholder: 'Rubro, Semilla'
      },
      detail: {
        title: function(data) {
          return 'Cultivo: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'lote__id',
      limit: 10,
      page: 1,
      filter: ''
    };

    vm.data = {};

    vm.meta = {
      searchForm: {},
      fields: [{
        name: 'lote',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getLotesSiembra',
        placeholder: 'Lote de Siembra'
      }, {
        name: 'area_siembra',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getAreasSiembra',
        placeholder: 'Area de Siembra',
        mapper: function(item) {
          return {
            id: item.id,
            nombre: item.nombre,
            type: item.hasOwnProperty('capacidad') ? 'invernadero' : 'parcela'
          }
        },
        checkings: [{
          type: 'required',
          message: 'Debes seleccionar un Area de Siembra'
        }]
      }]
    };

    vm.tabOptions = [{
      title: 'Agregar',
      submitButton: 'Registrar',
      handler: 'createCultivo'
    }, {
      title: 'Detalle',
      submitButton: 'Actualizar',
      handler: 'updateCultivo'
    }];

    activate();

    function activate() {
      console.log('Cultivos Controller');
      vm.detail ? getItem() : getData();
      vm.detailTab = !vm.detail ? vm.tabOptions[0] : vm.tabOptions[1];
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

    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    vm.logItem = function() {
      console.log(vm.item);

    }

    vm.formIsValid = function() {
      return true;
    }

    vm.switchTab = function() {
      var data = _.head(vm.item);
      vm.detailTab = vm.tabOptions[1];
      data.lote = {
        id: data.cultivo_lote.id,
        nombre: data.cultivo_lote.nombre
      };

      angular.copy(data, vm.form);
    }

    vm.showGridBottomSheet = function() {
      $mdBottomSheet.show({
          templateUrl: 'assets/views/bottom-action-bar/bottom-action-bar.html',
          controller: 'ListBottomSheetController',
          clickOutsideToClose: false,
          locals: {
            items: [{
              id: 'add',
              name: 'agregar'
            }, {
              id: 'edit',
              name: 'editar'
            }, {
              id: 'view',
              name: 'ver detalle'
            }]
          }
        })
        .then(function(clickedItem) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('clicked!')
            .position('top right')
            .hideDelay(1500)
          );
        });
    };

    vm.handleForm = function(handler) {

      if (_.isEmpty(vm.form)) return;

      if (vm.form.area_siembra.type === 'parcela') {
        vm.form.parcela = vm.form.area_siembra.id;
        delete vm.form.invernadero;
      } else {
        vm.form.invernadero = vm.form.area_siembra.id;
        delete vm.form.parcela;
      }

      //field formatting
      if (vm.form.fecha_siembra) {
        vm.form['fecha_siembra'] = moment(vm.form['fecha_siembra'])
          .format('YYYY-MM-DD');
      }
      var query = _.mapValues(vm.form, function(o) {
        return _.isObject(o) ? o.id : o;
      });


      $siembras[handler](query)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    vm.spawnDeleteModal = function(ev) {

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cosecha_cultivo.length) {
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
            return $siembras['deleteCultivo'](vm.item[0])
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
          .textContent('Este Lote de siembra posee ' + vm.item[0].cosecha_cultivo.length + ' cosechas asociadas.')
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
      vm.promise = $siembras.getCultivos(vm.query)
        .then(success);
    };

    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;
      if (vm.timeout) $timeout.cancel(vm.timeout);
      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });

    $scope.$watchCollection('vm.item', function(current, original) {
      if (!current) return;
      console.log(current);
    });

    $scope.$watch('vm.form.fecha_siembra', function(current, original) {
      if (!current) return;
      if (!_.isObject(current)) {
        vm.form.fecha_siembra = new Date(current);
      }
    });

    $scope.$watch('vm.currentTab', function(current, original) {
      if (!current && !vm.detail) {
        vm.form = {};
        vm.item = [];
        return;
      }
    });
  }
})();
