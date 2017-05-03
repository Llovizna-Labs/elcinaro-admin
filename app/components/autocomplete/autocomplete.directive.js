(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('autoComplete', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/autocomplete/autocomplete.html',
      scope: {
        meta: '=',
        item: '=?ngModel'
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['_', '$scope', '$log', '$siembras', '$suelos'];

  /* @ngInject */
  function Controller(_, $scope, $log, $siembras, $suelos) {
    var vm = this;

    vm.simulateQuery = false;
    vm.isDisabled = false;
    vm.validation = true;
    vm.touched = false;
    vm.form = {};

    // list of `state` value/display objects
    vm.querySearch = querySearch;


    activate();

    function activate() {
      console.log('autocomplete directive');
      console.log(vm.meta);
      console.log(vm.item);

      //if (vm.item) vm.searchText = vm.item;
    }


    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(q) {
      console.log('doing query with', q);

      var query = {
        page: 1,
        limit: 100,
        filter: '',
        order: '-id',
        filter: q
      }

      var handlers = {
        getRubros: function() {
          return $siembras.getRubros(query);
        },
        getCultivos: function() {
          return $siembras.getCultivos(query);
        },
        getProovedores: function() {
          return $siembras.getProovedores(query);
        },
        getUnidades: function() {
          return $siembras.getUnidades(query);
        },
        getMedidas: function() {
          return $siembras.getMedidas(query);
        },
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        },
        getSemillas: function() {
          return $siembras.getSemillas(query);
        },
        getAreasSiembra: function() {
          return $suelos.getAreasSiembra(query);
        },
        getLotesSiembra: function() {
          return $siembras.getLotes(query);
        }
      }

      var mapper = function(item) {
        return {
          id: item.id,
          nombre: item.nombre
        }
      };

      return handlers[vm.meta.handler]()
        .then(function(resp) {
          return _.map(resp.results, vm.meta.mapper || mapper);
        });

    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }


    $scope.$watch('vm.item', function(c, o) {
      if(!c) return;
      console.log(c);
      vm.touched = true;

    });

    $scope.$watch('vm.form', function(c,o) {
      console.log(c, o);
    })

  }
})();
