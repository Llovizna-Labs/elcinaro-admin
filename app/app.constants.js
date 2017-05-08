(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .constant('_', window._)
    .constant('jQuery', window.jQuery)
    .constant('Dropzone', window.Dropzone)
    .constant('moment', window.moment)
    .constant('pdfMake', window.pdfMake)
    //.constant('baseApi', 'http://localhost:8000');
    .constant('baseApi', 'https://elcinaro-backend.herokuapp.com');
})();
