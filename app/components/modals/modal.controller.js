(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ModalController', Controller);

  Controller.$inject = ['_', '$scope', '$q', '$http', '$timeout', '$mdDialog', '$admin', '$insumos', '$plagas', '$pedidos', '$siembras', '$proovedores', '$suelos', 'payload'];

  /* @ngInject */
  function Controller(_, $scope, $q, $http, $timeout, $mdDialog, $admin, $insumos, $plagas, $pedidos, $siembras, $proovedores, $suelos, payload) {
    var vm = this;


    $scope.meta = {
      options: {}
    };


    activate();

    function activate() {
      console.log('modal controller');
      $scope.meta = angular.copy(payload);
    }

    $scope.close = function() {
      $mdDialog.hide();
    }

    $scope.handle = function(cancel) {
      console.log(cancel);

      if (cancel) {
        $mdDialog.cancel();
      }

      
      handle(payload.type, payload.handler, $scope.meta.data)
        .then(function(resp) {
          $mdDialog.hide(resp);
        })
        .catch(function(err) {
          console.log(err);
        });
    }


    $scope.selectHandler = function(name, type, map) {
      console.log(name, type);

      var query = {
        page: 1,
        limit: 100,
        filter: '',
        order: '-id'
      }

      if ($scope.meta['options'][name]) return;

      var handlers = {
        getRubros: function() {
          return $siembras.getRubros(query);
        },
        getCultivos: function() {
          return $siembras.getCultivos(query);
        },
        getProovedores: function() {
          return $siembras.getProovedores(query);
        },
        getUnidades: function() {
          return $siembras.getUnidades(query);
        },
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        },
        getSemillas: function() {
          return $siembras.getSemillas(query);
        }
      }

      if (!handlers.hasOwnProperty(type)) return;

      return handlers[type]()
        .then(function(resp) {

          $scope.meta['options'][name] = _.map(resp.results, function(i) {
            return {
              id: i.id,
              name: i.nombre
            }
          });

        })
        .catch(function(err) {
          console.log(err);
        })
    }


    $scope.isInput = function(item) {
      return _.includes(['email', 'text', 'password'], item.type);
    }

    $scope.$watch('meta', function(o, c) {
      console.log(o, c);
    });


    function handle(type, handler, data) {
      switch (type) {
        case 'clientes':
          return $pedidos[handler](data);
          break;
        case 'semillas':
          return $siembras[handler](data);
          break;
        case 'proovedores':
          return $proovedores[handler](data);
          break;
        case 'admin':
          return $admin[handler](data);
          break;
        case 'insumos':
          return $insumos[handler](data);
          break;
        case 'rubros':
          return $siembras[handler](data);
          break;
        case 'plagas':
          return $plagas[handler](data);
          break;
        case 'suelos':
          return $suelos[handler](data);
          break;
        case 'cosechas':
          return $siembras[handler](data);
          break;
        default:
          return fake(data);
      }
    }

    function fake(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve(data);
      }, Math.random() * 1000, false);

      return deferred.results;
    }
  }
})();
