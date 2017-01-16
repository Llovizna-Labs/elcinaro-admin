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
      createCultivo: createCultivo,
      updateCultivo: updateCultivo,
      deleteCultivo: deleteCultivo,
      getRubros: getRubros,
      getLotes: getLotes,
      createLoteSiembra: createLoteSiembra,
      updateLoteSiembra: updateLoteSiembra,
      deleteLoteSiembra: deleteLoteSiembra,
      getProovedores: getProovedores,
      getProovedorCategoria: getProovedorCategoria,
      getUnidades: getUnidades,
      getMedidas: getMedidas,
      createSemilla: createSemilla,
      updateSemilla: updateSemilla,
      createRubro: createRubro,
      updateRubro: updateRubro,
      deleteRubro: deleteRubro,
      getCosechas: getCosechas,
      createCosecha: createCosecha,
      updateCosecha: updateCosecha,
      deleteCosecha: deleteCosecha,
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
        return _.isObject(o) ? o.id : o;
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


    function createCultivo(payload) {
      var deferred = $q.defer();
      $http.post(baseApi + '/cultivos/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateCultivo(payload) {
      var deferred = $q.defer();
      $http.put(baseApi + '/cultivos/' + payload.id + '/', payload)
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


    function deleteCultivo(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/cultivos/' + payload.id + '/')
        .success(function(data) {
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


    function createLoteSiembra(payload) {
      var deferred = $q.defer();
      //fieldFormatting

      $http.post(baseApi + '/lotes/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateLoteSiembra(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      $http.put(baseApi + '/lotes/' + payload.id + '/', payload)
        .success(function(data) {
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

    function getMedidas() {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve({
          results: [{
            id: 1,
            nombre: 'Centimetros(cm)'
          }, {
            id: 2,
            nombre: 'Milimetros (mm)'
          }, {
            id: 3,
            nombre: 'Mililitros(cm)'
          }, {
            id: 4,
            nombre: 'Litro (l)'
          }, {
            id: 5,
            nombre: 'Kilogramo(kg)'
          }, {
            id: 6,
            nombre: 'Miligramos (mg)'
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


    function getCosechas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/cosechas/', {
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

    function createCosecha(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_cosecha'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD', true)
          .isValid() ? o.id : o;
      });

      $http.post(baseApi + '/cosechas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateCosecha(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_cosecha'] = moment(payload['fecha_cosecha'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD')
          .isValid() ? o.id : o;
      });

      $http.put(baseApi + '/cosechas/' + payload.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteCosecha(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/cosechas/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createRubro(query) {
      var deferred = $q.defer();
      $http.post(baseApi + '/rubros/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateRubro(payload) {
      var deferred = $q.defer();
      $http.put(baseApi + '/rubros/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteRubro(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/rubros/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteLoteSiembra(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/lotes/' + payload.id + '/')
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
