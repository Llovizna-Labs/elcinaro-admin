(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$proovedores', factory);

  factory.$inject = ['_', '$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory(_, $http, $q, baseApi) {
    var service = {
      createProovedor: createProovedor,
      updateProovedor: updateProovedor,
      deleteProovedor: deleteProovedor
    };

    return service;

    function updateProovedor(query) {
      var deferred = $q.defer();
      $http.put(baseApi + '/proovedores/' + query.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createProovedor(payload) {
      var deferred = $q.defer();

      console.log(payload);

      var params = _.mapValues(payload, function(item) {
        return _.isObject(item) ? item.id : item;
      });

      console.log(params);
      $http.post(baseApi + '/proovedores/', params)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteProovedor(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/proovedores/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();