(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('CosechasController', Controller);

  Controller.$inject = ['$scope', '$http', '$mdDialog', '$util', '$siembras'];

  /* @ngInject */
  function Controller($scope, $http, $mdDialog, $util, $siembras) {
    var vm = this;

    vm.title = 'Cosechas';

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Inventario de Cosechas',
      search: {
        placeholder: 'Nombre'
      },
      detail: {
        title: function(data) {
          return 'Cosecha: ' + data.join(' ');
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
      fecha_cosecha: new Date(),
      cantidad: '',
      cultivo: '',
      medida: ''
    }

    var fieldsMeta = [{
      placeholder: 'Fecha Cosecha',
      name: 'fecha_cosecha',
      type: 'date',
      icon: 'perm_identity'
    }, {
      name: 'cantidad',
      type: 'number',
      icon: 'perm_identity'
    }, {
      name: 'medida',
      type: 'select',
      icon: 'perm_identity',
      placeholder: 'Medida',
      handler: 'getMedidas',
    }, {
      name: 'cultivo',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getCultivos',
      placeholder: 'Cultivo',

    }];


    activate();

    function activate() {
      console.log('CosechasController');
      getData();
    }



    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {

      _.mapValues(data.results, function(item) {
        item.cultivo = {
          id: item.cultivo_cosecha.id,
          nombre: item.cultivo_cosecha.cultivo_lote.nombre
        }

        item.medida = _.find($util.getUnidades(), function(i) {
          return i.id === item.medida;
        })
      });

      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.item = [];
      vm.promise = $siembras.getCosechas(vm.query)
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
              type: 'cosechas',
              handler: isNew ? 'createCosecha' : 'updateCosecha',
              title: isNew ? 'Registrar Cosecha' : 'Actualizar Datos Cosecha',
              data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                return (moment(i, 'YYYY-MM-DD', true)
                  .isValid() ? new Date(i) : i) || (i.hasOwnProperty('id') ? i.id : i);
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
          return $siembras['deleteCosecha'](vm.item[0])
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
      console.log(c);
    });
  }
})();
