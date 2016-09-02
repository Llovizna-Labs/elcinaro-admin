(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .directive('dropzone', dropzone);

  dropzone.$inject = ['Dropzone'];

  function dropzone(Dropzone) {
    var directive = {
      link: link,
      restrict: 'EA',
      scope: {
        dropzone: '=dropzone',
        reset: '@reset'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var config, zone;

      config = scope.dropzone;
      zone = new Dropzone(element[0], config.options);

      if (scope.reset) {
        zone.on('complete', function(file) {
          zone.removeFile(file);
        });
      }

      angular.forEach(config.eventHandlers, function(handler, event) {
        zone.on(event, handler);
      });
    }
  }

})();
