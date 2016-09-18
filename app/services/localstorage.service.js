(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$localstorage', $localstorage);

  $localstorage.$inject = ['$window'];

  function $localstorage($window) {
    var service = {
      set: set,
      get: get,
      setObject: setObject,
      getObject: getObject,
      remove: remove
    };

    return service;

    //////////

    function set(key, value) {
      $window.localStorage[key] = value;
    }

    function get(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    }

    function setObject(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    }

    function getObject(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || (defaultValue !== undefined ? defaultValue : '{}'));
    }

    function remove(key) {
      return $window.localStorage.removeItem(key);
    }
  }
})();
