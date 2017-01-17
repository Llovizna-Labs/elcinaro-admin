(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .filter('formatter', filter);

  function filter() {
    return filterFilter

    function filterFilter(params) {
      var opciones = {
        1: 'Desmalezamiento',
        2: 'Riego',
        3: 'Fertilizacion',
        4: 'Plaguicida',
        5: 'Limpieza',
        'crecimientocultivo': 'Crecimiento',
        'insumocultivo': 'Insumo'
      }
      return opciones[params];
    }
  }
})();
