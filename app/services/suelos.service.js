(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$suelos', factory);

  factory.$inject = ['$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory($http, $q, baseApi) {
    var service = {
      getInvernaderos: getInvernaderos,
      getParcelas: getParcelas,
      getTipoParcela: getTipoParcela,
      deleteParcela: deleteParcela,
      deleteInvernadero: deleteInvernadero
    };

    return service;

    function getInvernaderos(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/invernaderos/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getParcelas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/parcelas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getTipoParcela(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/tipo-parcelas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function deleteParcela(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/parcelas/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteInvernadero(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/invernaderos/' + id + '/')
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
