(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('adbOrdersResume', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.resume.html',
      scope: {
        options: '=',
        form: '=',
        total: '=',
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['_', '$http', '$q'];

  /* @ngInject */
  function Controller(_, $http, $q) {
    var vm = this;

    activate();

    function activate() {

    }

    vm.formatImpressions = function() {

      if (!vm.form.impressionType || !vm.form.options.impressions.hasOwnProperty('id')) return;

      var types = {
        impressionsUnits: _.join([vm.form.options.impressions.quantity, vm.form.options.impressions.type], " "),
        impressionsTime: _.join([vm.form.options.impressions.time, vm.form.options.impressions.period], " "),
      }

      return types[vm.form.impressionType];
    }

    vm.formatTarget = function() {
      var target = {
        distance:  {
          value: vm.form.options.distance,
          render: _.join(['Distance:', (vm.form.options.distance.distance || ''), 'Km'], ' ')
        },
        age: {
          value: vm.form.options.age,
          render: _.join(['Age between:', _.join(vm.form.options.age.range, '-') ], ' ')
        },
        gender:  {
          value: vm.form.options.gender,
          render: _.join(['Gender:', vm.form.options.gender.gender ], ' ')
        },
        interests: {
          value: vm.form.options.interests,
          render: _.join(['Interests:', vm.form.options.interests.quantity ], ' ')
        }
      }

      var selected = _.pickBy(target, function(i) {
        return i.value.hasOwnProperty('id');
      });

      if (_.isEmpty(selected)) return '';

      return _.join(['Target: ', _.map(Object.keys(selected), function(key) {
        return target[key].render;
      })], '');

    }


    vm.formatResume = function() {
      return resume;
    }
  }
})();
