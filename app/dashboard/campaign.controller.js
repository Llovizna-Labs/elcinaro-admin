(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('CampaignController', Controller);

  Controller.$inject = ['DataService'];

  function Controller(DataService) {
    var vm = this;

    activate()

    ////////////////

    function activate() {
    	DataService.getCampaigns().then(function(res) {
    		console.log(res)
    	});
    }
  }

})();
