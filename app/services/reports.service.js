(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$reports', factory);

  factory.$inject = ['_', 'pdfMake', 'moment',  '$util'];

  /* @ngInject */
  function factory(_, pdfMake, moment, $util) {
    var service = {
      getList: getList,
      createInstance: createInstance,
      sampleTable: sampleTable,
      draftTable: draftTable
    };

    return service;

    function getList(modulo) {
      var list = [{
        id: 'cultivos-list',
        modulo: 'cultivos',
        name: 'Listado Cultivos',
        description: 'Devuelve el Listado de cultivos',
        handler: '$siembras',
        method: 'getCultivos'
      }, {
        id: 'proveedores-list',
        modulo: 'proveedores',
        name: 'Listado Proovedores',
        description: 'Devuelve el Listado de proveedores',
        handler: '$proveedores',
        method: 'getProovedores'
      }, {
        id: 'client-list',
        modulo: 'clientes',
        name: 'Listado Clientes',
        description: 'Devuelve el Listado de clientes',
        handler: '$clientes',
        method: 'getClientes'
      },
      {
        id: 'semillas-list',
        modulo: 'semillas',
        name: 'Listado Semillas',
        description: 'Devuelve el Listado de semillas',
        handler: '$clientes',
        method: 'getSemillas'
      },{
        id: 'cultivos-detail-list',
        modulo: 'cultivos',
        name: 'Detalle Cultivo',
        description: 'Detalle Cultivo',
        handler: '$siembras',
        method: 'getCultivoDetail'
      }, {
        id: 'cultivos-list',
        modulo: 'rubros',
        name: 'Detalle Rubro',
        description: 'Detalle Rubro',
        handler: '$siembras',
        method: 'getRubros'
      }];

      return list.filter(function(item) {
        return item.modulo === modulo;
      }).map(function(option) {
        option.value = option.name.toLowerCase();
        return option;
      });
    }

    function createInstance(docDefinition) {
      return pdfMake.createPdf(docDefinition);
    }

    function sample() {
      var docDefinition = {
        content: 'This is an sample PDF printed with pdfMake'
      };
      return pdfMake.createPdf(docDefinition);
    }

    function draftTable(title, description,content) {

      var styles = {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        metaHeader: {
          alignment: 'center',
          margin: 20
        }
      };

      var dd = {
        header: function(currentPage, pageCount) {
          return {text: 'SGA El Cínaro' , style: 'metaHeader'}
        },
        footer: function (currentPage, pageCount, pageSize) {
          return {text: moment().format('LLL') , style: 'metaHeader'}
        },
        content: [{
          image: $util.getEncodedImage(),
          alignment: 'center',
          height: 100,
          width: 100
        },
          {
          text: title,
          style: 'header'
        },{
          text: description
        }, {
          style: 'tableExample',
          table: {
            body: content
          }
        }],
        styles: styles
      };


      return pdfMake.createPdf(dd);

    }

    function sampleTable() {
      var docDefinition = {
        content: [{
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{
                text: 'Bold value',
                bold: true
              }, 'Val 2', 'Val 3', 'Val 4']
            ]
          }
        }]
      };

      return docDefinition;
    }
  }
})();
