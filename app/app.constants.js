(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .constant('_', window._)
    .constant('Dropzone', window.Dropzone)
    .constant('braintree', window.braintree)
    .constant('baseApi', 'http://api.anydaybuddy.com');
})();
