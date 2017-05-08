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

    //Service binding
    vm.semillas = [];
    vm.rubros = [];
    vm.proveedores = [];
    //

    //Directives Binding
    vm.semillasMeta = {
      placeholder: 'Selecciona semilla'
    };

    vm.rubrosMeta = {
      placeholder: 'Seleccione un rubro'
    };

    vm.proveedorMeta = {
      placeholder: 'Servicio de germinación'
    };
    //
    //Local Binding
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

    var loteDetailObject = {
      fecha_enviado: moment().format('YYYY-MM-DD'),
      fecha_recibido: moment().format('YYYY-MM-DD'),
      cantidad_semillas_enviadas: 0,
      cantidad_plantulas_recibidas: 0,
      semilla_utilizada: null,
      germinado: true
    }

    var formTemplate =  {
      lote: {
        codigo: '',
        rubro: null,
        fecha_enviado: new Date()
      },
      dataset: [{
        cantidad_semillas_enviadas: 0,
        cantidad_plantulas_recibidas: 0
      }]
    };

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

    vm.currentTab = 0;

    vm.tabOptions = [{
      title: 'Agregar',
      submitButton: 'Registrar',
      rubro: 'Registrar rubro',
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
      cantidad_plantulas_recibidas: 0,
      cantidad_semillas_enviadas: 0
    }

    vm.multiform = {};

    activate();

    function activate() {
      console.log('Lotes Controller');
      vm.detail ? getItem() : getData();
      vm.detailTab = !vm.detail ? vm.tabOptions[0] : vm.tabOptions[1];


      // controller meta data
      $q.all([
          $siembras.getSemillas({}),
          $siembras.getRubros({}),
          $siembras.getProovedores({ categoria: 'germinador' })
        ])
        .then(function(results) {
          console.log('semillas resolved');
          vm.semillas = results[0]['results'].map(function(semilla) {
            return _.merge({ display: semilla.nombre, value: semilla.nombre.toLowerCase() }, semilla);
          });

          console.log('rubros resolved');
          vm.rubros = results[1]['results'].map(function(rubro) {
            return _.merge({ display: rubro.nombre, value: rubro.nombre.toLowerCase() }, rubro);
          });

          console.log('proveedores resolved');
          vm.proveedores = results[2]['results'].map(function(prov) {
            return _.merge({ display: prov.nombre, value: prov.nombre.toLowerCase() }, prov);
          });
        })
    }


    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    vm.switchTab = function() {
      console.log('switching tab', vm.item);
      vm.currentTab = 1;
      var lote = _.head(vm.item);

      var incomingData = {
        lote: _.merge(lote, {
          rubro: {
            id: lote.rubro,
            display: lote.rubro_lote || ''
          },
          proveedor: {
            id: lote.proveedor || 5,
            display: lote.proveedor_lote || ''
          }
        }),
        dataset: lote.semilla_lote
      }

      angular.copy(incomingData, vm.multiform);

      vm.detailTab = vm.tabOptions[1];

    }

    vm.attachLote = function() {
      vm.multiform.dataset.push({
        cantidad_semillas_enviadas: 0,
        cantidad_plantulas_recibidas: 0
      });
    }

    vm.sendForm = function() {
      console.log(vm.multiform);

      //FORMATTING
      var payload = {
        id: vm.multiform.lote.id || null,
        codigo: vm.multiform.lote.codigo,
        rubro: vm.multiform.lote.rubro.id,
        proovedor: vm.multiform.lote.proveedor.id,
        fecha_enviado: moment(vm.multiform.lote.fecha_enviado).format('YYYY-MM-DD'),
        semilla_lote: vm.multiform.dataset.map(function(item) {
          return _.merge(item, { semilla_utilizada: item.semilla.id });
        })
      };

      console.log(payload);
      var method = payload.id ? 'updateLoteSiembra': 'createLoteSiembra';
      $siembras[method](payload).then(function(resp) {
        console.log(resp);
      }).catch(function(err) {
        console.log(err)
      })
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


    $scope.$watch('vm.currentTab', function(c, o) {
      //vm.detailTab = !vm.form.hasOwnProperty('id') ? vm.tabOptions[0] : vm.tabOptions[1];
      console.log('current tab', c);
      if (!c) getData();
      if (c && !vm.item.length) angular.copy(formTemplate, vm.multiform);
      if (c) vm.item = [];
    });
  }
})();
