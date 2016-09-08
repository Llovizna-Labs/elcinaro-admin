(function() {
  'use strict';
  angular
    .module('AnyDayBuddyAds')
    .service('CategoryService', CategoryService);

  CategoryService.$inject = ['$http', '$q', 'baseApi'];

  function CategoryService($http, $q, baseApi) {
    var service = {
    	categories: [],
      getCategories: getCategories
    };

    return service;

    function getCategories(parent, options) {
      var deferred = $q.defer();

      $http.get(baseApi + '/category/' + parent, {
          params: {
            all: options.all || true,
            official: options.official || true
          }
        })
        .success(function(res) {
          deferred.resolve(res);
          angular.copy(res.subcategories, service.categories);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();
