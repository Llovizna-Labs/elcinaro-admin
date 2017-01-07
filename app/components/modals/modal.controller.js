(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ModalController', Controller);

  Controller.$inject = ['$scope', '$http', '$mdDialog', '$pedidos', 'payload'];

  /* @ngInject */
  function Controller($scope, $http, $mdDialog, $pedidos, payload) {
    var vm = this;


    $scope.meta = {};


    activate();

    function activate() {
      console.log('modal controller');
      console.log(payload);
      $scope.meta = angular.copy(payload);
    }

    $scope.close = function() {
      $mdDialog.hide();
    }

    $scope.handle = function(cancel) {
      console.log(cancel);

      if (cancel) {
        $mdDialog.cancel();
      }

      handle(payload.type, payload.handler, $scope.meta.data)
        .then(function(resp) {
          $mdDialog.hide(resp);
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    $scope.$watch('meta', function(o, c) {
      console.log(o, c);
    });


    function handle(type, handler, data) {
      switch (type) {
        case 'clientes':
          return $pedidos[handler](data);
          break;
        default:
          return {};
      }
    }
  }
})();
