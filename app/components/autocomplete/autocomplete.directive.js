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

    // list of `state` value/display objects
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;

    vm.newState = newState;

    activate();

    function activate() {
      console.log('autocomplete directive');
      console.log(vm.meta);
      console.log(vm.item);
    }



    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(q) {

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
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        }
      }

      return handlers[vm.meta.handler]().then(function(resp) {
        return _.map(resp.results, function(item) {
          return {
            id: item.id,
            nombre: item.nombre
          }
        })
      });

    }


    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
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

  }
})();
