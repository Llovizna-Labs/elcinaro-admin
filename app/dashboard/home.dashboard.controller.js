/**
 * @ngdoc controller
 * @name HomeController
 * @requires $rootScope
 * @description
 *
 * Maneja el comportamiento de la vista principal
 *
 */

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('HomeDashboardController', HomeController);

  HomeController.$inject = ['_', '$scope', '$rootScope', '$mdDialog', 'jQuery', '$siembras', '$insumos', '$seguimiento', '$util'];

  /* @ngInject */
  function HomeController(_, $scope, $rootScope, $mdDialog, jQuery, $siembras, $insumos, $seguimiento, $util) {
    var vm = this;

    vm.actions = $util.getActions();

    vm.title = 'HomeDashboardController';
    vm.data = [];
    vm.all = false;
    vm.addActivity = true;
    //chips
    vm.querySearch = querySearch;
    vm.selectedItem = null;
    vm.searchText = null;
    vm.selectedRubros = [];
    vm.selectedActions = [];
    vm.selectedCultivos = [];
    vm.rubros = [];
    vm.cultivos = [];
    vm.insumos = [];
    vm.observations = [];
    vm.toggle = toggle;
    vm.selectCultivo = selectCultivo;
    vm.detailItem = detailItem;
    vm.removeItem = removeItem;
    vm.submit = submit;

    vm.query = {
      page: 1,
      limit: 10,
      order: '-fecha_realizacion',
      filter: ''
    }
    activate();

    ////////////////

    function activate() {
      console.log('HomeController');
      getActividades();
      getRubros();
      getInsumos();
    }


    function submit() {
      // console.log(vm.observations);
      // console.log(vm.selectedCultivos);
      //var bulk = _.merge(vm.selectedCultivos, _.keyBy(vm.observations, 'selector'));

      var data = _.map(vm.observations, function(i) {
        var item = i;
        item.cultivo = i.cultivo.id;
        if (item.hasOwnProperty('fecha_aplicacion')) {
          item.fecha_aplicacion = moment(i.fecha_aplicacion, 'DD-MM-YYYY HH:mm A', true);
        }
        return item;
      });

      $seguimiento.createActividades(_.groupBy(data, 'selector'))
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    function getActividades() {
      $seguimiento.getActividades(vm.query)
        .then(function(resp) {
          console.log(resp);
          vm.data = resp;
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    function getInsumos() {
      $insumos.getInsumos({})
        .then(function(resp) {
          vm.insumos = _.map(resp.results, function(i) {
            return {
              name: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre)
            }
          })
        })
        .catch(function(err) {
          console.log(err);
        })
        .finally(function() {

        })
    }

    function getRubros() {
      $siembras.getRubros({
          page: 1,
          limit: 10,
          order: '-nombre',
          filter: ''
        })
        .then(function(resp) {
          vm.rubros = _.map(resp.results, function(i) {
            return {
              name: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre)
            }
          })
        })
        .catch(function(err) {

        })
        .finally(function() {

        })
    }

    function getCultivos(query) {
      $siembras.getCultivos(query)
        .then(function(resp) {
          vm.cultivos = _.map(resp.results, function(i) {
            return {
              name: i.codigo,
              description: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre),
              selected: false,
              plaguicida: {},
              fertilizacion: {},
              riego: {},
              observaciones: {
                text: 'Observaciones'
              }
            }
          })
        })
        .catch(function(err) {

        })
        .finally(function() {

        })
    }


    function selectCultivo(index, item) {
      vm.cultivos[index].selected = !item.selected;

      var index = _.findIndex(vm.selectedCultivos, function(i) {
        return i.id === item.id;
      });

      if (!item.selected && vm.selectedCultivos[index]) {
        vm.selectedCultivos = vm.selectedCultivos.splice(index, 1);
      } else {
        vm.selectedCultivos.push(item);
      }
    }

    function detailItem(ev, item) {
      if (!_.includes([3, 4, 6], item.type)) return;

      angular.copy(item, $util.item);
      $mdDialog.show({
          controller: 'ActionController',
          controllerAs: 'vm',
          templateUrl: 'assets/views/seguimiento/' + item.template,
          clickOutsideToClose: true,
          fullscreen: true
        })
        .then(function(answer) {
          console.log(answer);
          // if (_.isArray(item.cultivo[item.selector])) {
          //   item.cultivo[item.selector].push(answer);
          // } else if (_.isObject(item.cultivo[item.selector])) {
          //   item.cultivo[item.selector] = answer;
          // } else {
          //   console.log('undefined');
          // }

          _.merge(item, answer);

          console.log(item);
        }, function() {
          console.log('cancelled');
        });
    };

    function removeItem(event, index) {
      console.log(index);
      index--;
      if (index === -1) {
        return vm.observations.shift();
      } else {
        return vm.observations.splice(index, 1);
      }
    }

    function toggle(value) {
      if (!value) {
        _.map(vm.cultivos, function(item, index) {
          item.selected = false;
        });
        vm.selectedCultivos = [];
        return;
      }
      _.map(vm.cultivos, function(item, index) {
        selectCultivo(index, item);
      });
    }

    /**
     * Search utils.
     */
    function querySearch(data, query) {
      var results = query ? data.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item._lowername.indexOf(lowercaseQuery) === 0);
      };

    }


    $scope.$watch('vm.data', function(current, original) {
      if (!current) return;
      var temp = _.groupBy(vm.data.results, function(o) {
        return moment(moment(o.fecha_realizacion)
            .startOf('day'))
          .format();
      });
      vm.formattedData = temp;
    });

    function draftObservation() {
      var options = {
        riego: 'Se aplico riego rutinario',
        desmalezamiento: 'se aplicado desmalezamiento en el area',
        fertilizacion: 'Se aplico fertilizacion en el cultivo',
        plaguicida: 'Se aplico plaguicida en el cultivo',
        limpieza: 'Se aplico limpieza en el area'
      }
      var content = _.map(vm.selectedActions, function(action) {
        return _.map(vm.selectedCultivos, function(item, index) {
          return {
            id: new Date(),
            text: item.description,
            content: options[angular.lowercase(action.name)],
            type: action.id,
            template: action.template,
            selector: angular.lowercase(action.name),
            cultivo: item,
            action: action.name
          };
        })
      });

      vm.observations = [].concat.apply([], content);
    }

    $scope.$watchCollection('vm.selectedRubros', function(current, original) {
      if (!current.length) return;

      var query = _.map(current, function(i) {
          return i.name;
        })
        .join(',');

      getCultivos({
        page: 1,
        limit: 10,
        order: 'fecha_siembra',
        filter: query
      });
    });

    $scope.$watchCollection('vm.selectedActions', function(current, original) {
      draftObservation();
    });

    $scope.$watchCollection('vm.selectedCultivos', function(current, original) {
      if (!current.length || current.length === original.length) return;
      draftObservation();
    });

    $scope.$watchCollection('vm.observations', function(current, original) {
      console.log( 'observations', current);
    }, true);

    $scope.$watchCollection('vm.info', function(current, original) {
      console.log(current);
    }, true);
  }
})();
