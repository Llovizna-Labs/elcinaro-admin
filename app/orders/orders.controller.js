(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('ordersController', ordersController);

  ordersController.$inject = ['dataService'];

  /* @ngInject */
  function ordersController(dataService) {
    var vm = this;
    vm.tab = 0;
    vm.infotabs = [{
      'name': 'Advertiser Profile'
    }, {
      'name': 'Campaign Setup'
    }, {
      'name': 'Check-out'
    }]
    activate();

    function activate() {
      dataService.getInfo()
        .then(function(resp) {
            vm.data = resp.data;
            console.log(resp.data);
          },
          function(err) {
            console.log(err);
          });
    }
  }
})();
