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
        total: '=',
        control: '='
      },
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  Controller.$inject = ['CategoryService', '$scope'];

  /* @ngInject */
  function Controller(CategoryService, $scope) {
    var vm = this;
    vm.interests = [];
    vm.categories = [];
    activate();

    ////////////////

    function activate() {
      console.log('campaign directive');
    }


    function getCategories() {
      vm.loading = true;
      CategoryService.getCategories('all', {
        all: true,
        official: true,
        country: vm.form.country
      }).then(function(res) {
        vm.categories = res;
      }).finally(function() {
        vm.loading = false;
      });
    }

    $scope.$watch('vm.control.selectedTab', function(c, o) {
      console.log('current tab ', c);
      if(c == 2) getCategories();
    }, true)


  }
})();
