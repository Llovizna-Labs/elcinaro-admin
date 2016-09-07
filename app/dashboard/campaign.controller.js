(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('CampaignController', Controller);

  Controller.$inject = ['_', '$state', '$stateParams', 'DataService'];

  function Controller(_, $state, $stateParams, DataService) {
    var vm = this;
    vm.ads = [];
    vm.loading = false;
    vm.detail = $stateParams.id ? true : false;
    activate()

    ////////////////

    function activate() {
      console.log();
      vm.loading = true;
      getCampaigns($stateParams.id || 'all');
    }

    function getCampaigns(params) {
      DataService.getCampaigns(params).then(function(res) {
        vm.ads = vm.detail?[res]: res;
        console.log(res);
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.loading = false;
      });
    }
  }

})();
