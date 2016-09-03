(function() {
    'use strict';

    angular
        .module('AnyDayBuddyAds')
        .controller('DashboardController', Controller);

    Controller.$inject = ['$http', '$q'];

    /* @ngInject */
    function Controller($http, $q) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
