(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SemillasController', Controller);

  Controller.$inject = ['_','moment', '$scope', '$http', '$q', '$timeout', '$mdDialog','$util', '$siembras'];

  /* @ngInject */
  function Controller(_, moment, $scope, $http, $q, $timeout, $mdDialog, $util, $siembras) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.isUpdating = false;
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

    //Pdf Configuration
    vm.pdfMeta = {
      modulo: 'semillas',
      title:   'Semillas',
      subtitle:'Listado de Semillas',
      fields: ['codigo', 'nombre', 'semilla_familia.nombre', 'semilla_proovedor.nombre', 'cantidad', 'precio_compra'],
      headers: ['codigo', 'nombre', 'semilla', 'proveedor', 'cantidad', 'precio_compra'],
      order: ['semilla_familia.nombre']
    };

    vm.meta = {
      searchForm: {},
      fields: [{
        name: 'familia',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getRubros',
        placeholder: 'Seleccione un Rubro',
        repeat: true,
        required: true,
        hasError: false
      },
      {
        name: 'proovedor',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getProovedores',
        placeholder: 'Seleccione un Proovedor',
        repeat: true,
        required: true,
        hasError: false
      },
      {
        name: 'unidad',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getUnidades',
        placeholder: 'Unidad',
        repeat: false,
        hasError: false,
        required: true
      }]
    };

    vm.errors = null;


    //Selector
    vm.metaFieldsByname = _.keyBy(vm.meta.fields, 'name')

    var formTemplate = {
      nivel_germinacion: 0.0,
      cantidad: 0.0,
      precio_compra: 0.0,
      codigo: null,
      fecha_compra: new Date(),
      descripcion: null,
      familia: null,
      proovedor: null,
      unidad: null
    }


    //activate();

    function activate() {
      console.log('Semillas Controller');

      vm.item.pop();
      vm.form = formTemplate;
      vm.isUpdating = false;
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
      vm.errors = null;
      vm.loading = true;

      var handler = vm.isUpdating ? 'updateSemilla' : 'createSemilla';

      $siembras[handler](vm.form)
        .then(function(resp) {
          console.log(resp);
          vm.item[0] = resp;
        })
        .catch(function(err) {
          console.log(err);
          vm.errors = err;
        }).finally(function(){
          vm.loading = false;
        });
    }

    vm.editItem = function editItem() {
      vm.currentTab = 1;
      vm.isUpdating = true;
      vm.form = _.assign(vm.item[0], {
        familia: {
          id: vm.item[0].familia,
          nombre: vm.item[0].semilla_familia.nombre
        },
        proovedor: {
          id: vm.item[0].proovedor,
          nombre: vm.item[0].semilla_proovedor.nombre
        },
      })
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
          return $siembras['deleteSemilla']({id: id})
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);

            }).finally(function(){
              vm.item = [];
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
      if (_.isEmpty(c)) {
        vm.isUpdating = false;
        return;
      }
      vm.isUpdating = true;
    });

    $scope.$watch('vm.form.fecha_compra', function(c, o) {
      if (_.isEmpty(c)) return;
      vm.form['fecha_compra'] = new Date(c);
    });

    $scope.$watch('vm.form', function(c,o) {

    }, true);

    $scope.$watch('vm.currentTab', function(c, o) {
      console.log('current tab', c);
      if (c == o) return;
      if (!c) activate();
    });
  }
})();
