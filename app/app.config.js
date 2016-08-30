(function() {
  'use strict';
  angular
    .module('AnyDayBuddyAds')
    .config(config);

  config.$inject = ['$mdThemingProvider', '$locationProvider'];

  function config($mdThemingProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $mdThemingProvider.definePalette('primary', {
      '50': '#9dceda',
      '100': '#65b2c5',
      '200': '#429ab0',
      '300': '#2f6d7c',
      '400': '#265966',
      '500': '#1e4650',
      '600': '#16323a',
      '700': '#0d1f23',
      '800': '#050c0d',
      '900': '#000000',
      'A100': '#9dceda',
      'A200': '#65b2c5',
      'A400': '#265966',
      'A700': '#0d1f23',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });
    $mdThemingProvider.definePalette('accent', {
      '50': '#d0ebed',
      '100': '#99d4d8',
      '200': '#70c3c8',
      '300': '#43a7ae',
      '400': '#3a9298',
      '500': '#327d82',
      '600': '#29686c',
      '700': '#215256',
      '800': '#183d40',
      '900': '#10282a',
      'A100': '#d0ebed',
      'A200': '#99d4d8',
      'A400': '#3a9298',
      'A700': '#215256',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.definePalette('warn', {
      '50': '#faeee6',
      '100': '#ecc3a7',
      '200': '#e2a379',
      '300': '#d57b3e',
      '400': '#c96b2b',
      '500': '#b05e26',
      '600': '#975121',
      '700': '#7e431b',
      '800': '#643616',
      '900': '#4b2810',
      'A100': '#faeee6',
      'A200': '#ecc3a7',
      'A400': '#c96b2b',
      'A700': '#7e431b',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('primary')
      .accentPalette('accent')
      .warnPalette('warn');
  }
})();
