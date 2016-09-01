(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('OrdersController', Controller);

  Controller.$inject = ['_', '$scope', '$mdDialog', 'DataService'];

  function Controller(_, $scope, $mdDialog, DataService) {
    var vm = this;

    vm.openImage = openImage;
    vm.add = add;
    vm.total = 0;

    vm.options = {
      target: {
        display: [],
        media: [],
        impressionsUnits: [],
        impressionsTime: [],
        distance: [],
        age: [],
        gender: []
      }
    };

    vm.form = {
      media: {},
      options: {
        display: {},
        impressions: {},
        distance: {},
        age: {},
        gender: {}
      }
    }

    activate();

    function activate() {
      DataService.getOptions().then(function(resp) {
        console.log(resp);
        vm.options.target = do_merge(resp);
        console.log(vm.form);
      }).catch(function(err) {
        console.log(err);
      })
    }


    function do_merge(roles) {

      // Custom merge function ORs together non-object values, recursively
      // calls itself on Objects.
      var merger = function(a, b) {
        if (_.isObject(a)) {
          return _.merge({}, a, b, merger);
        } else {
          return a || b;
        }
      };

      // Allow roles to be passed to _.merge as an array of arbitrary length
      var args = _.flatten([{}, roles, merger]);
      return _.merge.apply(_, args);
    }


    function openImage($event, image) {
      $mdDialog.show({
        fullscreen: true,
        targetEvent: $event,
        clickOutsideToClose: true,
        templateUrl: 'app/shared/layout/imageModal.html',
        locals: {
          image: image
        },
        controller: ['$scope', 'image', function(scope, image) {
          scope.image = image;
        }]
      });
    }


    function add() {
      $mdDialog.show({
        templateUrl: 'app/components/ad/advertisementModal.html',
        clickOutsideToClose: true,
        fullscreen: true
      });
    }

    $scope.$watch('vm.form', function(c, o) {
      console.log(c);

      vm.total = c.media.hasOwnProperty('fee')?c.media.fee:0;

      _.map(c.options, function(item) {
        if (item.hasOwnProperty('fee')){
            vm.total +=  vm.total * item.fee;
        }

        if (item.hasOwnProperty('discount')){
            vm.total -= vm.total * item.discount;
        }

      })
    }, true)

  }
})();
