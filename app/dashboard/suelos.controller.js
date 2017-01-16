(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SuelosController', Controller);

  Controller.$inject = ['_', '$http', '$q', '$mdDialog', '$suelos'];

  /* @ngInject */
  function Controller(_, $http, $q, $mdDialog, $suelos) {
    var vm = this;

    vm.query = {
      order: '-id',
      limit: 10,
      page: 1,
      filter: ''
    };

    vm.item = null;

    vm.data = {
      suelos: [],
      invernaderos: [],
    };

    vm.toolbar = {
      title: function(title) {
        return _.join(title, ' ');
      }
    }

    var fieldsMeta = [{
      name: 'codigo',
      type: 'text',
      icon: 'description'
    }, {
      name: 'ubicacion',
      type: 'text',
      icon: 'info'
    }, {
      name: 'ancho_medida',
      type: 'number',
      icon: 'info'
    }, {
      name: 'largo_medida',
      type: 'number',
      icon: 'info'
    }];
    //, {
    //   name: 'tipo',
    //   type: 'select',
    //   icon: 'info',
    //   handler: 'getTipoParcela',
    //   placeholder: 'Tipo'
    // }];

    var invernaderoFieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'description'
    }, {
      name: 'codigo',
      type: 'text',
      icon: 'description'
    }, {
      name: 'ubicacion',
      type: 'text',
      icon: 'info'
    }, {
      name: 'capacidad',
      type: 'number',
      icon: 'info'
    }];

    var parcelaObject = {
      codigo: '',
      tipo: 3,
      ubicacion: 'El Cinaro',
      largo_medida: 1.0,
      ancho_medida: 2.0,
      capacidad: 0,
    }


    var invernaderoObject = {
      nombre: '',
      codigo: '',
      ubicacion: 'El Cinaro',
      capacidad: 0,
    }

    activate();

    function activate() {
      console.log('Suelos Controller');
      getData();
    }

    function getData() {
      vm.item = null;
      $q.all([$suelos.getParcelas(vm.query), $suelos.getInvernaderos(vm.query)])
        .then(function(response) {
          vm.data.suelos = response[0];
          vm.data.invernaderos = response[1];
        });
    }

    vm.detail = function(detail, handler) {
      vm.item = detail;
      vm.item.handler = handler;
    }

    vm.spawnModal = function(ev, isNew, type) {

      var metaValues = fieldsMeta;
      var plainObj = parcelaObject;

      var options = {
        handler: isNew ? 'createParcela' : 'updateParcela',
        title: isNew ? 'Registrar Parcela' : 'Actualizar Datos Parcela',
      };

      if ((vm.item && vm.item.handler === 'invernaderos') || type === 'invernaderos') {
        options = {
          handler: isNew ? 'createInvernadero' : 'updateInvernadero',
          title: isNew ? 'Registrar Invernadero / Terraza' : 'Actualizar Datos Invernadero / Terraza',
        };
        metaValues = invernaderoFieldsMeta;
        plainObj = invernaderoObject;
      }

      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: _.merge({
              type: 'suelos'
            }, options, {
              data: !_.isEmpty(vm.item) ? _.mapValues(vm.item, function(i) {
                return i.hasOwnProperty('id') ? i.id : i;
              }) : plainObj,
              fields: metaValues,
              options: {

              }
            })
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


    vm.spawnDeleteModal = function(ev) {

      if (!vm.item) return;

      if (vm.item.cultivos_count) {
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

        var handler = vm.item.handler === 'parcelas' ? 'deleteParcela' : 'deleteInvernadero';

        $mdDialog.show(confirm)
          .then(function() {
            return $suelos[handler](vm.item.id)
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
          .textContent('Esta area de siembra posee ' + vm.item.cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }
  }
})();
