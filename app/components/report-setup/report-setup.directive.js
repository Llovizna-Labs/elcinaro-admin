(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('reportSetup', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/report-setup/report-setup.html',
      scope: {
        module: '=',
        meta: '=?'
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['$mdDialog', '$reports'];

  /* @ngInject */
  function Controller($mdDialog, $reports) {
    var vm = this;

    activate();

    function activate() {
      console.log('reports-directive')
    }

    vm.spawnReportModal = function(ev) {
      $mdDialog.show({
          controller: 'ReportsController',
          templateUrl: 'assets/views/report-setup/report-setup-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: {
            meta: vm.meta ? vm.meta : {
              modulo: vm.modulo || 'cultivos',
              title: 'PDF page',
              subtitle: 'PDF content',
              fields: ['id','nombre','descripcion']
            }
          },
          clickOutsideToClose: false
        })
        .then(function(answer) {
          console.log(answer)
        }, function() {
          console.log('rejected');
        });
    };
  }
})();
