(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .constant('_', window._)
    .constant('jQuery', window.jQuery)
    .constant('Dropzone', window.Dropzone)
    .constant('braintree', window.braintree)
    .constant('baseApi', 'http://localhost:1338');
    //.constant('baseApi', 'https://api.anydaybuddy.com');
})();
