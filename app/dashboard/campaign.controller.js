(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('CampaignController', Controller);

  Controller.$inject = ['DataService'];

  function Controller(DataService) {
    var vm = this;
    vm.ads = [];
    vm.loading = false;

    activate()

    ////////////////

    function activate() {
      vm.loading = true;

      DataService.getOptions().then(function(res) {
        console.log(res);
        getCampaigns();
      });
    }


    function getCampaigns() {
      DataService.getCampaigns().then(function(res) {
        vm.ads = res;
        console.log(res);
        vm.loading = false;
      });
    }
  }

})();
