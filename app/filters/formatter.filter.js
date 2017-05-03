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
        3: 'Observaciones',
        4: 'Limpieza',
        5: 'Plaguicida',
        6: 'Fertilizacion',
        7: 'Cosecha',
        'crecimientocultivo': 'Crecimiento',
        'insumocultivo': 'Insumo'
      }
      return opciones[params];
    }
  }
})();
