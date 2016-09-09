(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .controller('OrdersController', Controller);

  Controller.$inject = [
    '_',
    '$scope',
    '$rootScope',
    '$mdDialog',
    '$mdToast',
    'DataService',
    'UtilService'
  ];

  function Controller(_, $scope, $rootScope, $mdDialog, $mdToast, DataService, UtilService) {
    var vm = this;

    vm.openImage = openImage;
    vm.add = add;
    vm.total = 0;
    vm.success = false;

    vm.control = {
      selectedTab: $rootScope.user ? 1 : 0,
      tabs: [{
        valid: $rootScope.user ? false : true,
        show: true
      }, {
        valid: false,
        show: true,
      }, {
        valid: false,
        show: true
      }, {
        valid: false,
        show: true
      }]
    };

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
      banner: {},
      marker: {},
      options: {
        display: {},
        impressions: {},
        distance: {},
        age: {},
        gender: {},
        interests: {},
        activities: []
      },
      customer: {},
      country: $rootScope.user ? (_.find(UtilService.getCountries(), function(i) {
        return i.name === $rootScope.user.country || i.id === $rootScope.user.country;
      }) || 'CA') : 'CA',
      categories: []
    };

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

    vm.selectedTab = function() {
      return $rootScope.user ? vm.control.selectedTab : 0;
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

    function showValidNotification() {
      $mdToast.show(
        $mdToast.simple()
        .textContent('Awesome, you can now go to next step!')
        .position('bottom right')
        .hideDelay(3000)
      );
    }

    function validateBanner(display) {
      var check = false;
      if (display === 'both') {
        check = _.isEmpty(_.pickBy(vm.form.banner, _.isNull)) ? true : false;
        return check;
      }

      check = (vm.form.banner.description && vm.form.banner.url && vm.form.banner[display]) ? true : false;
      return check;
    }

    function validateMap() {
      return !_.isEmpty(vm.form.marker);
    }

    function validateStepZero() {
      var media = vm.form.media.display
      var display = vm.form.options.display.display;

      switch (display) {
        case 'banner':
          return validateBanner(media)
          break;
        case 'map':
          return validateMap()
          break;
        default:

      }
      return false;
    }

    function validateForm() {
      switch (vm.control.selectedTab) {
        case 1:
          {
            if (vm.form.media.hasOwnProperty('id') && vm.form.options.display.hasOwnProperty('id') && validateStepZero()) {
              vm.control.tabs[2].valid = true;
              showValidNotification();
            } else {
              vm.control.tabs[2].valid = false;
            }
            break;
          }
        case 2:
          {
            if (vm.form.options.impressions.hasOwnProperty('id')) {
              vm.control.tabs[3].valid = true;

              showValidNotification();
            } else {
              vm.control.tabs[3].valid = false;
            }
            break;
          }
        default:
          console.log(vm.control.selectedTab);
      }
    }

    $scope.$watch(function() {
      return $rootScope.user;
    }, function() {
      if (!$rootScope.user) return;

      vm.form.country = _.find(UtilService.getCountries(), function(i) {
        return i.name === $rootScope.user.country || i.id === $rootScope.user.country;
      }).id;
    }, true);

    $scope.$watch('vm.form', function(c, o) {
      console.log(c);

      validateForm();

      vm.total = c.media.hasOwnProperty('fee') ? c.media.fee : 0;

      _.map(c.options, function(item) {
        if (item.hasOwnProperty('fee')) {
          vm.total += vm.total * item.fee;
        }

        if (item.hasOwnProperty('discount')) {
          vm.total -= vm.total * item.discount;
        }

      })
    }, true)

  }
})();
