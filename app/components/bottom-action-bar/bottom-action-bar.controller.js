(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ListBottomSheetController', Controller);

  Controller.$inject = ['$scope', 'items'];

  /* @ngInject */
  function Controller($scope, items) {
    var vm = this;

    activate();

    function activate() {
      angular.copy(items, $scope.items)
      console.log('bottom action bar');
    }

    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  }
})();
