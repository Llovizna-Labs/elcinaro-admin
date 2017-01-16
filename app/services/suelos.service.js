(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$suelos', factory);

  factory.$inject = ['_', '$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory(_, $http, $q, baseApi) {
    var service = {
      getInvernaderos: getInvernaderos,
      getParcelas: getParcelas,
      createParcela: createParcela,
      updateParcela: updateParcela,
      createInvernadero: createInvernadero,
      updateInvernadero: updateInvernadero,
      getTipoParcela: getTipoParcela,
      deleteParcela: deleteParcela,
      deleteInvernadero: deleteInvernadero,
      getAreasSiembra: getAreasSiembra
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

    function createInvernadero(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.post(baseApi + '/invernaderos/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function updateParcela(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.put(baseApi + '/parcelas/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateInvernadero(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.put(baseApi + '/invernaderos/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createParcela(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.post(baseApi + '/parcelas/', query)
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


    function getAreasSiembra(query) {
      var deferred = $q.defer();
      $q.all([getInvernaderos(query), getParcelas(query)])
        .then(function(resp) {
          deferred.resolve({results: _.merge(resp[0].results, resp[1].results)});
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();
