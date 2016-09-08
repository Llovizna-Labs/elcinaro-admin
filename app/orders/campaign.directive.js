(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .directive('adbOrdersCampaign', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.campaign.html',
      scope: {
        options: '=',
        form: '=',
        total: '='
      },
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  Controller.$inject = ['CategoryService'];

  /* @ngInject */
  function Controller(CategoryService) {
    var vm = this;
    vm.interests = [];
    vm.categories = [];

    activate();

    ////////////////

    function activate() {
      getCategories();
    }


    function getCategories() {
      vm.loading = true;
      CategoryService.getCategories('all', {
        all: true,
        official: true
      }).then(function(res) {
        vm.categories = [].concat.apply([], _.map(res.res, function(i, key) {
          return !_.isUndefined(key) ? i : [];
        }));

        console.log('Categories', vm.categories);
      }).finally(function() {
        vm.loading = false;
      });
    }

  }
})();
