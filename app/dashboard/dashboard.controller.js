(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('DashboardController', Controller);

  function Controller(_, $http, $q) {
    var vm = this;

    ////////////////
    ///
    ///
    ///
    vm.routes = getNavigationRoutes()

    activate();

    function activate() {
      console.log('DashboardController');
    }


    function getNavigationRoutes() {
      return _.orderBy([{
        link: 'dashboard.home',
        icon: 'grade',
        title: 'Home'
      }, {
        link: 'dashboard.cultivos',
        icon: 'grade',
        title: 'Cultivos'
      }, {
        link: 'dashboard.semillas',
        title: 'Semillas',
        icon: 'grade'
      }, {
        link: 'dashboard.lotes',
        title: 'Lotes de Siembra',
        icon: 'grade'
      }, {
        link: 'dashboard.plagas',
        title: 'Plagas',
        icon: 'grade'
      }, {
        link: 'dashboard.clientes',
        title: 'Clientes',
        icon: 'person_pin'
      }, {
        link: 'dashboard.insumos',
        title: 'Insumos',
        icon: 'grade'
      }, {
        link: 'dashboard.proovedores',
        title: 'Proovedores',
        icon: 'grade'
      }, {
        link: 'dashboard.users',
        title: 'Usuarios',
        icon: 'grade'
      }, {
        link: 'dashboard.suelos',
        title: 'Areas de Siembra',
        icon: 'grade'
      }, {
        link: 'dashboard.rubros',
        title: 'Rubros',
        icon: 'grade'
      }], ['title'], ['asc']);
    }

  }

})();
