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
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['$http', '$q'];

  /* @ngInject */
  function Controller($http, $q) {
    var vm = this;

    activate();

    function activate() {

    }
  }
})();
