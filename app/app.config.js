(function() {
  'use strict';
  angular
    .module('ElCinaroAdmin')
    .config(config)
    .config(corsProvider)
    .config(iconProvider)
    .config(mapsProvider);

  corsProvider.$inject = ['$httpProvider'];

  function corsProvider($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  }

  mapsProvider.$inject = ['uiGmapGoogleMapApiProvider'];

  function mapsProvider(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAonFuCDb7HjXUz0uocKbEGUJz91IL9EVs', //adb-site-0 key
      // key: 'AIzaSyAlW6hun7VwpFPv0fx_KOUh52l08BRpjYM',
      libraries: 'places'
    });
  }

  iconProvider.$inject = ['$mdIconProvider'];

  function iconProvider($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.
    $mdIconProvider
      .fontSet('farm', 'farm-icons') // This sets our default fontset className.
      .icon('compost', 'assets/images/icons/icon-compost.svg') // Register a specific icon (by name)
      .icon('spade', 'assets/images/icons/icon-spade.svg'); // Register icon in a specific set
  }



  function config($mdThemingProvider, $locationProvider) {

    $mdThemingProvider.definePalette('primary', {
      '50': '#3ea34c',
      '100': '#379143',
      '200': '#307e3b',
      '300': '#296c32',
      '400': '#22592a',
      '500': '1B4721',
      '600': '#143518',
      '700': '#0d2210',
      '800': '#061007',
      '900': '#000000',
      'A100': '#45b655',
      'A200': '#56bf64',
      'A400': '#68c675',
      'A700': '#000000',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });
    $mdThemingProvider.definePalette('accent', {
      '50': '#1c3216',
      '100': '#25441d',
      '200': '#2f5625',
      '300': '#39682d',
      '400': '#427935',
      '500': '#4c8b3c',
      '600': '#60af4c',
      '700': '#6eb85c',
      '800': '#7ec06d',
      '900': '#8ec87f',
      'A100': '#60af4c',
      'A200': '569D44',
      'A400': '#4c8b3c',
      'A700': '#9ecf91',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.definePalette('warn', {
      '50': '#fbcba3',
      '100': '#fabd8b',
      '200': '#f9af72',
      '300': '#f8a15a',
      '400': '#f79341',
      '500': 'F68529',
      '600': '#f57711',
      '700': '#e26b0a',
      '800': '#ca5f09',
      '900': '#b25407',
      'A100': '#fcd9bc',
      'A200': '#fde7d4',
      'A400': '#fef5ed',
      'A700': '#994806',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('primary')
      .accentPalette('accent')
      .warnPalette('warn');
  }
})();
