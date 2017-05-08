(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ReportsController', Controller);

  Controller.$inject = ['_','moment', '$scope', '$q', '$log', '$timeout', '$mdDialog', '$pedidos', '$siembras', '$suelos', '$reports', 'meta'];

  /* @ngInject */
  function Controller(_, moment, $scope, $q, $log, $timeout, $mdDialog, $pedidos,$siembras, $suelos, $reports, meta) {

    $scope.simulateQuery = false;
    $scope.isDisabled = false;

    $scope.repos = $reports.getList(meta.modulo);
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.selectedItem = null;

    activate();

    function activate() {
      console.log('report setup controller');
    }

    $scope.cancel = function() {
      console.log('cancelling');
      $mdDialog.hide();
    }

    $scope.printerSetup = function() {
      console.log($scope.selectedItem);

      handlers($scope.selectedItem)
        .then(function(resp) {
          var headers = meta.headers ? meta.headers : meta.fields;

          var table = $reports.draftTable(meta.title, meta.subtitle,
                      _.orderBy(resp, (meta.order || ['id']), ['asc']).reduce(function(acc, item) {
                          acc.push(_.values(_.at(item, meta.fields)));
                          return acc;
                      }, [headers.map(function(item) {
                          return {text: _.capitalize(item), style: 'tableHeader'};
                      })]));

        table.download(_.snakeCase(meta.title + (moment().format('YYYY-MM-DD-hh:mm'))));


        })
        .catch(function(err) {
          console.log(err);
        });

    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      console.log(query);
      var results = query ? $scope.repos.filter(createFilterFor(query)) : $scope.repos;

      return results;
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }


    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }


    /**
     * [handlers description]
     * @method handlers
     * @param  {[type]} q [description]
     * @return {[type]}   [description]
     */
    function handlers(item) {
      console.log('doing query with', item.method);

      var query = {
        page: 1,
        limit: 1000,
        filter: '',
        order: '-id',
        filter: ''
      }

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
        getMedidas: function() {
          return $siembras.getMedidas(query);
        },
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        },
        getSemillas: function() {
          return $siembras.getSemillas(query);
        },
        getAreasSiembra: function() {
          return $suelos.getAreasSiembra(query);
        },
        getLotesSiembra: function() {
          return $siembras.getLotes(query);
        },
        getClientes: function() {
          return $pedidos.getClientes(query);
        }
      }

      var mapper = function(item) {
        return item;
      };

      return handlers[item.method]()
        .then(function(resp) {
          return _.map(resp.results, item.mapper || mapper);
        });
    }

    $scope.$watch('selectedItem', function(c, o) {
      console.log(c);
    })
  }
})();
