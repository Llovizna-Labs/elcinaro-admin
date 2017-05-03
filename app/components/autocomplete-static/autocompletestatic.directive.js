(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('autoCompleteStatic', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/autocomplete-static/autocomplete-static.html',
      scope: {
        meta: '=',
        data: '=',
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

  Controller.$inject = ['_', '$scope', '$log'];

  /* @ngInject */
  function Controller(_, $scope, $log) {
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
      console.log('autocomplete-static directive');
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
    function querySearch(query) {
      var results = query ? vm.data.filter(createFilterFor(query)) : vm.data;
      return results;
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

    $scope.$watch('vm.searchText', function(c, o) {
      console.log(c);
    });

  }
})();
