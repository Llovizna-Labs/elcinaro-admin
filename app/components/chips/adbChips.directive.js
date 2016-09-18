(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('adbChips', adbChips);

  function adbChips() {
    var directive = {
      restrict: 'EA',
      controllerAs: 'vm',
      controller: Controller,
      bindToController: true,
      templateUrl: 'assets/views/chips/adbChips.html',
      scope: {
        'map': '=?',
        'max': '@?',
        'list': '=',
        'label': '@?',
        'click': '=?',
        'create': '=?',
        'filter': '=?',
        'id': '@?adbId',
        'disabled': '=',
        'editable': '=',
        'hideList': '=?',
        'listClass': '@?',
        'showCount': '=?',
        'placeholder': '@?',
        'model': '=?ngModel'
      }
    };
    return directive;
  }

  Controller.$inject = ['_', 'jQuery', '$scope', '$timeout', '$mdConstant', '$mdDialog'];

  function Controller(_, jQuery, $scope, $timeout, $mdConstant, $mdDialog) {
    var vm = this;
    vm.queryGiven = '';
    vm.input = '#chips-' + (vm.id || Date.now()) + ' md-autocomplete-wrap input';
    activate();

    ////////////////

    function activate() {
      if (!vm.map) vm.map = { name: 'name', image: 'image', type: 'chip' };
      if (!vm.placeholder) vm.placeholder = 'Type here to filter';
      if (vm.listClass === undefined) vm.listClass = 'fixed-rows';
      if (vm.showCount === undefined) vm.showCount = true;
      if (vm.create) jQuery(document).keydown(detectKey);
      if (vm.filter === undefined) vm.filter = {};
      if (_.isUndefined(vm.model)) vm.model = [];
    }

    vm.querySearch = function(query) {
      vm.queryGiven = query;
      var results = query && vm.list.length ? vm.list.filter(createFilterFor(query)) : [];

      if (vm.create) create(results, query);

      return results;
    };

    vm.selectItem = function(item) {
      console.log(vm.model);
      if (vm.editable) vm.model.push(item);
      if (_.isFunction(vm.click)) vm.click(item);
    };

    vm.exists = function(item) {
      return _.findIndex(vm.model, function(o) {
        return o[vm.map.name] == item[vm.map.name];
      }) >= 0;
    };

    vm.stopPropagation = function(e) {
      e.stopPropagation();
    };

    function createFilterFor(query) {
      return function filterFn(item) {
        if (vm.exists(item)) return false;
        return (item[vm.map.name].toLowerCase().indexOf(query.toLowerCase()) != -1);
      };
    }

    function create(results, query) {
      if (!results.length && query.indexOf(',') != -1) {
        var objects = vm.create(query.split(',').filter(function(e) {
          return e && e.length;
        }));
        console.log(objects);
        angular.forEach(objects, function(o) {
          vm.selectItem(o);
        });

        jQuery(vm.input).val('');
      }
    }

    function detectKey(e) {
      e.stopPropagation();

      if (jQuery(vm.input).is(':focus') && e.which == 13) {
        $scope.$apply(function() {
          var results = (vm.queryGiven && vm.list.length)? vm.list.filter(createFilterFor(vm.queryGiven)) : [];
          create(results, vm.queryGiven + ',');
        });
      }
    }

    $scope.$watch('vm.list', function(c, o) {
      console.log(c);

    })
  }
})();
