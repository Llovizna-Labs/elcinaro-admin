(function() {
  'use strict';
  angular
    .module('ElCinaroAdmin')
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

      $http.get(baseApi + '/campaign/categories/', {
          params: {
            country: options.country
          }
        })
        .success(function(res) {
          deferred.resolve(res);
          console.log(res.length);
          angular.copy(res, service.categories);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();
