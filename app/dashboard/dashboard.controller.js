(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('DashboardController', Controller);

  function Controller($http, $q) {
    var vm = this;

    ////////////////
    ///
    activate();

    function activate() {
      console.log('DashboardController');
    }

  }

})();
