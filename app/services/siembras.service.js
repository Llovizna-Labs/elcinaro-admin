(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$siembras', factory);

  factory.$inject = ['$http', '$q', '$timeout', 'baseApi', 'moment'];

  /* @ngInject */
  function factory($http, $q, $timeout, baseApi, moment) {
    var service = {
      getSemillas: getSemillas,
      getCultivos: getCultivos,
      getRubros: getRubros,
      getLotes: getLotes,
      getProovedores: getProovedores,
      getProovedorCategoria: getProovedorCategoria,
      getUnidades: getUnidades,
      createSemilla: createSemilla,
      updateSemilla: updateSemilla,
      cultivos: [],
      semillas: [],
      lotes: []
    };

    return service;

    function getSemillas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/semillas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.semillas);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createSemilla(payload) {
      var deferred = $q.defer();

      //field formatting
      payload['fecha_compra'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return  _.isObject(o)  ? o.id : o;
      });

      console.log(query);

      $http.post(baseApi + '/semillas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateSemilla(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_compra'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      $http.put(baseApi + '/semillas/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function getCultivos(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/cultivos/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.cultivos);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getLotes(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/lotes/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.lotes);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getRubros(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/rubros/', {
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

    function getAreasSiembra(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/rubros/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
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

    function getUnidades() {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve({
          results: [{
            id: 1,
            nombre: 'gramos'
          }, {
            id: 2,
            nombre: 'unidades'
          }]
        });
      }, Math.random() * 1000, false);

      return deferred.promise;
    }

    function getProovedorCategoria(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/categorias/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
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

    function getProovedores(query) {

      var deferred = $q.defer();
      $http.get(baseApi + '/proovedores/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
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
  }
})();
