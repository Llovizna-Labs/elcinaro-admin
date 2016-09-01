(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .directive('adbOrdersCheckout', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.checkout.html',
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

  Controller.$inject = ['_', 'braintree', '$scope','$http', '$q', 'DataService'];

  /* @ngInject */
  function Controller(_, braintree, $scope, $http, $q, DataService) {
    var vm = this;
    vm.checkout = {};

    activate();

    function activate() {
      DataService.getClientToken().then(function(res) {
        console.log(res);
        setupGateway(res.clientToken);
      }).catch(function(err) {
        console.log(err);
      })
    }

    function setupGateway(token) {
      braintree.setup(token, 'custom', {
        paypal: {
          container: 'paypal-container',
          singleUse: true,
          amount: 10.00,
          currency: 'USD',
          locale: 'en_us',
          enableShippingAddress: true
        },
        onPaymentMethodReceived: function(obj) {
          doSomethingWithTheNonce(obj.nonce);
        },
        onReady: function(integration) {
          vm.checkout = integration;
        }
      });
    }

    function doSomethingWithTheNonce(res) {
      console.log(res);
    }

    // // When you are ready to tear down your integration
    // checkout.teardown(function() {
    //   checkout = null;
    //   // braintree.setup can safely be run again!
    // });

    $scope.$watch('vm.checkout', function(c, o) {
      if (!c) return;

      console.log(c);
    });
  }
})();
