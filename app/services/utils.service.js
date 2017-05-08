(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$util', factory);

  function factory($mdToast) {
    var service = {
      getCountries: getCountries,
      getActions: getActions,
      getMedidas: getMedidas,
      getUnidades: getUnidades,
      convertDateStringsToDates: convertDateStringsToDates,
      showSimpleToast: showSimpleToast,
      item: {},
      getEncodedImage: getEncodedImage
    };

    return service;

    function showSimpleToast(message) {
         $mdToast.showSimple(message);
    }



    function convertDateStringsToDates(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;

      var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
          // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === "object") {
          // Recurse into object
          convertDateStringsToDates(value);
        }
      }
    }


    function getUnidades() {
      return [{
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
      }];
    }

    function getMedidas() {
      return [{
        id: 1,
        nombre: 'L.'
      }, {
        id: 2,
        nombre: 'mL.'
      }, {
        id: 3,
        nombre: 'g.'
      }, {
        id: 4,
        nombre: 'Kg.'
      }]
    }

    function getActions() {
      return [{
        name: 'Desmalezamiento',
        _lowername: 'desmalezamiento',
        id: 1
      }, {
        template: 'riego.tmpl.html',
        name: 'Riego',
        _lowername: 'riego',
        id: 2
      }, {
        name: 'Fertilizacion',
        _lowername: 'fertilizacion',
        id: 6,
        template: 'fertilizacion.tmpl.html'
      }, {
        name: 'Plaguicida',
        _lowername: 'plagicida',
        id: 5,
        template: 'plaguicida.tmpl.html'
      }, {
        name: 'Limpieza',
        _lowername: 'limpieza',
        id: 4
      }, {
        name: 'Observaciones',
        _lowername: 'observaciones',
        id: 3,
        template: 'observaciones.tmpl.html'
      }];
    }



    function getCountries() {
      return [{
        name: 'Afghanistan',
        id: 'AF'
      }, {
        name: 'Åland Islands',
        id: 'AX'
      }, {
        name: 'Albania',
        id: 'AL'
      }, {
        name: 'Algeria',
        id: 'DZ'
      }, {
        name: 'American Samoa',
        id: 'AS'
      }, {
        name: 'AndorrA',
        id: 'AD'
      }, {
        name: 'Angola',
        id: 'AO'
      }, {
        name: 'Anguilla',
        id: 'AI'
      }, {
        name: 'Antarctica',
        id: 'AQ'
      }, {
        name: 'Antigua and Barbuda',
        id: 'AG'
      }, {
        name: 'Argentina',
        id: 'AR'
      }, {
        name: 'Armenia',
        id: 'AM'
      }, {
        name: 'Aruba',
        id: 'AW'
      }, {
        name: 'Australia',
        id: 'AU'
      }, {
        name: 'Austria',
        id: 'AT'
      }, {
        name: 'Azerbaijan',
        id: 'AZ'
      }, {
        name: 'Bahamas',
        id: 'BS'
      }, {
        name: 'Bahrain',
        id: 'BH'
      }, {
        name: 'Bangladesh',
        id: 'BD'
      }, {
        name: 'Barbados',
        id: 'BB'
      }, {
        name: 'Belarus',
        id: 'BY'
      }, {
        name: 'Belgium',
        id: 'BE'
      }, {
        name: 'Belize',
        id: 'BZ'
      }, {
        name: 'Benin',
        id: 'BJ'
      }, {
        name: 'Bermuda',
        id: 'BM'
      }, {
        name: 'Bhutan',
        id: 'BT'
      }, {
        name: 'Bolivia',
        id: 'BO'
      }, {
        name: 'Bosnia and Herzegovina',
        id: 'BA'
      }, {
        name: 'Botswana',
        id: 'BW'
      }, {
        name: 'Bouvet Island',
        id: 'BV'
      }, {
        name: 'Brazil',
        id: 'BR'
      }, {
        name: 'British Indian Ocean Territory',
        id: 'IO'
      }, {
        name: 'Brunei Darussalam',
        id: 'BN'
      }, {
        name: 'Bulgaria',
        id: 'BG'
      }, {
        name: 'Burkina Faso',
        id: 'BF'
      }, {
        name: 'Burundi',
        id: 'BI'
      }, {
        name: 'Cambodia',
        id: 'KH'
      }, {
        name: 'Cameroon',
        id: 'CM'
      }, {
        name: 'Canada',
        id: 'CA'
      }, {
        name: 'Cape Verde',
        id: 'CV'
      }, {
        name: 'Cayman Islands',
        id: 'KY'
      }, {
        name: 'Central African Republic',
        id: 'CF'
      }, {
        name: 'Chad',
        id: 'TD'
      }, {
        name: 'Chile',
        id: 'CL'
      }, {
        name: 'China',
        id: 'CN'
      }, {
        name: 'Christmas Island',
        id: 'CX'
      }, {
        name: 'Cocos (Keeling) Islands',
        id: 'CC'
      }, {
        name: 'Colombia',
        id: 'CO'
      }, {
        name: 'Comoros',
        id: 'KM'
      }, {
        name: 'Congo',
        id: 'CG'
      }, {
        name: 'Congo, The Democratic Republic of the',
        id: 'CD'
      }, {
        name: 'Cook Islands',
        id: 'CK'
      }, {
        name: 'Costa Rica',
        id: 'CR'
      }, {
        name: 'Cote D\'Ivoire',
        id: 'CI'
      }, {
        name: 'Croatia',
        id: 'HR'
      }, {
        name: 'Cuba',
        id: 'CU'
      }, {
        name: 'Cyprus',
        id: 'CY'
      }, {
        name: 'Czech Republic',
        id: 'CZ'
      }, {
        name: 'Denmark',
        id: 'DK'
      }, {
        name: 'Djibouti',
        id: 'DJ'
      }, {
        name: 'Dominica',
        id: 'DM'
      }, {
        name: 'Dominican Republic',
        id: 'DO'
      }, {
        name: 'Ecuador',
        id: 'EC'
      }, {
        name: 'Egypt',
        id: 'EG'
      }, {
        name: 'El Salvador',
        id: 'SV'
      }, {
        name: 'Equatorial Guinea',
        id: 'GQ'
      }, {
        name: 'Eritrea',
        id: 'ER'
      }, {
        name: 'Estonia',
        id: 'EE'
      }, {
        name: 'Ethiopia',
        id: 'ET'
      }, {
        name: 'Falkland Islands (Malvinas)',
        id: 'FK'
      }, {
        name: 'Faroe Islands',
        id: 'FO'
      }, {
        name: 'Fiji',
        id: 'FJ'
      }, {
        name: 'Finland',
        id: 'FI'
      }, {
        name: 'France',
        id: 'FR'
      }, {
        name: 'French Guiana',
        id: 'GF'
      }, {
        name: 'French Polynesia',
        id: 'PF'
      }, {
        name: 'French Southern Territories',
        id: 'TF'
      }, {
        name: 'Gabon',
        id: 'GA'
      }, {
        name: 'Gambia',
        id: 'GM'
      }, {
        name: 'Georgia',
        id: 'GE'
      }, {
        name: 'Germany',
        id: 'DE'
      }, {
        name: 'Ghana',
        id: 'GH'
      }, {
        name: 'Gibraltar',
        id: 'GI'
      }, {
        name: 'Greece',
        id: 'GR'
      }, {
        name: 'Greenland',
        id: 'GL'
      }, {
        name: 'Grenada',
        id: 'GD'
      }, {
        name: 'Guadeloupe',
        id: 'GP'
      }, {
        name: 'Guam',
        id: 'GU'
      }, {
        name: 'Guatemala',
        id: 'GT'
      }, {
        name: 'Guernsey',
        id: 'GG'
      }, {
        name: 'Guinea',
        id: 'GN'
      }, {
        name: 'Guinea-Bissau',
        id: 'GW'
      }, {
        name: 'Guyana',
        id: 'GY'
      }, {
        name: 'Haiti',
        id: 'HT'
      }, {
        name: 'Heard Island and Mcdonald Islands',
        id: 'HM'
      }, {
        name: 'Holy See (Vatican City State)',
        id: 'VA'
      }, {
        name: 'Honduras',
        id: 'HN'
      }, {
        name: 'Hong Kong',
        id: 'HK'
      }, {
        name: 'Hungary',
        id: 'HU'
      }, {
        name: 'Iceland',
        id: 'IS'
      }, {
        name: 'India',
        id: 'IN'
      }, {
        name: 'Indonesia',
        id: 'ID'
      }, {
        name: 'Iran, Islamic Republic Of',
        id: 'IR'
      }, {
        name: 'Iraq',
        id: 'IQ'
      }, {
        name: 'Ireland',
        id: 'IE'
      }, {
        name: 'Isle of Man',
        id: 'IM'
      }, {
        name: 'Israel',
        id: 'IL'
      }, {
        name: 'Italy',
        id: 'IT'
      }, {
        name: 'Jamaica',
        id: 'JM'
      }, {
        name: 'Japan',
        id: 'JP'
      }, {
        name: 'Jersey',
        id: 'JE'
      }, {
        name: 'Jordan',
        id: 'JO'
      }, {
        name: 'Kazakhstan',
        id: 'KZ'
      }, {
        name: 'Kenya',
        id: 'KE'
      }, {
        name: 'Kiribati',
        id: 'KI'
      }, {
        name: 'Korea, Democratic People\'S Republic of',
        id: 'KP'
      }, {
        name: 'Korea, Republic of',
        id: 'KR'
      }, {
        name: 'Kuwait',
        id: 'KW'
      }, {
        name: 'Kyrgyzstan',
        id: 'KG'
      }, {
        name: 'Lao People\'S Democratic Republic',
        id: 'LA'
      }, {
        name: 'Latvia',
        id: 'LV'
      }, {
        name: 'Lebanon',
        id: 'LB'
      }, {
        name: 'Lesotho',
        id: 'LS'
      }, {
        name: 'Liberia',
        id: 'LR'
      }, {
        name: 'Libyan Arab Jamahiriya',
        id: 'LY'
      }, {
        name: 'Liechtenstein',
        id: 'LI'
      }, {
        name: 'Lithuania',
        id: 'LT'
      }, {
        name: 'Luxembourg',
        id: 'LU'
      }, {
        name: 'Macao',
        id: 'MO'
      }, {
        name: 'Macedonia, The Former Yugoslav Republic of',
        id: 'MK'
      }, {
        name: 'Madagascar',
        id: 'MG'
      }, {
        name: 'Malawi',
        id: 'MW'
      }, {
        name: 'Malaysia',
        id: 'MY'
      }, {
        name: 'Maldives',
        id: 'MV'
      }, {
        name: 'Mali',
        id: 'ML'
      }, {
        name: 'Malta',
        id: 'MT'
      }, {
        name: 'Marshall Islands',
        id: 'MH'
      }, {
        name: 'Martinique',
        id: 'MQ'
      }, {
        name: 'Mauritania',
        id: 'MR'
      }, {
        name: 'Mauritius',
        id: 'MU'
      }, {
        name: 'Mayotte',
        id: 'YT'
      }, {
        name: 'Mexico',
        id: 'MX'
      }, {
        name: 'Micronesia, Federated States of',
        id: 'FM'
      }, {
        name: 'Moldova, Republic of',
        id: 'MD'
      }, {
        name: 'Monaco',
        id: 'MC'
      }, {
        name: 'Mongolia',
        id: 'MN'
      }, {
        name: 'Montserrat',
        id: 'MS'
      }, {
        name: 'Morocco',
        id: 'MA'
      }, {
        name: 'Mozambique',
        id: 'MZ'
      }, {
        name: 'Myanmar',
        id: 'MM'
      }, {
        name: 'Namibia',
        id: 'NA'
      }, {
        name: 'Nauru',
        id: 'NR'
      }, {
        name: 'Nepal',
        id: 'NP'
      }, {
        name: 'Netherlands',
        id: 'NL'
      }, {
        name: 'Netherlands Antilles',
        id: 'AN'
      }, {
        name: 'New Caledonia',
        id: 'NC'
      }, {
        name: 'New Zealand',
        id: 'NZ'
      }, {
        name: 'Nicaragua',
        id: 'NI'
      }, {
        name: 'Niger',
        id: 'NE'
      }, {
        name: 'Nigeria',
        id: 'NG'
      }, {
        name: 'Niue',
        id: 'NU'
      }, {
        name: 'Norfolk Island',
        id: 'NF'
      }, {
        name: 'Northern Mariana Islands',
        id: 'MP'
      }, {
        name: 'Norway',
        id: 'NO'
      }, {
        name: 'Oman',
        id: 'OM'
      }, {
        name: 'Pakistan',
        id: 'PK'
      }, {
        name: 'Palau',
        id: 'PW'
      }, {
        name: 'Palestinian Territory, Occupied',
        id: 'PS'
      }, {
        name: 'Panama',
        id: 'PA'
      }, {
        name: 'Papua New Guinea',
        id: 'PG'
      }, {
        name: 'Paraguay',
        id: 'PY'
      }, {
        name: 'Peru',
        id: 'PE'
      }, {
        name: 'Philippines',
        id: 'PH'
      }, {
        name: 'Pitcairn',
        id: 'PN'
      }, {
        name: 'Poland',
        id: 'PL'
      }, {
        name: 'Portugal',
        id: 'PT'
      }, {
        name: 'Puerto Rico',
        id: 'PR'
      }, {
        name: 'Qatar',
        id: 'QA'
      }, {
        name: 'Reunion',
        id: 'RE'
      }, {
        name: 'Romania',
        id: 'RO'
      }, {
        name: 'Russian Federation',
        id: 'RU'
      }, {
        name: 'RWANDA',
        id: 'RW'
      }, {
        name: 'Saint Helena',
        id: 'SH'
      }, {
        name: 'Saint Kitts and Nevis',
        id: 'KN'
      }, {
        name: 'Saint Lucia',
        id: 'LC'
      }, {
        name: 'Saint Pierre and Miquelon',
        id: 'PM'
      }, {
        name: 'Saint Vincent and the Grenadines',
        id: 'VC'
      }, {
        name: 'Samoa',
        id: 'WS'
      }, {
        name: 'San Marino',
        id: 'SM'
      }, {
        name: 'Sao Tome and Principe',
        id: 'ST'
      }, {
        name: 'Saudi Arabia',
        id: 'SA'
      }, {
        name: 'Senegal',
        id: 'SN'
      }, {
        name: 'Serbia and Montenegro',
        id: 'CS'
      }, {
        name: 'Seychelles',
        id: 'SC'
      }, {
        name: 'Sierra Leone',
        id: 'SL'
      }, {
        name: 'Singapore',
        id: 'SG'
      }, {
        name: 'Slovakia',
        id: 'SK'
      }, {
        name: 'Slovenia',
        id: 'SI'
      }, {
        name: 'Solomon Islands',
        id: 'SB'
      }, {
        name: 'Somalia',
        id: 'SO'
      }, {
        name: 'South Africa',
        id: 'ZA'
      }, {
        name: 'South Georgia and the South Sandwich Islands',
        id: 'GS'
      }, {
        name: 'Spain',
        id: 'ES'
      }, {
        name: 'Sri Lanka',
        id: 'LK'
      }, {
        name: 'Sudan',
        id: 'SD'
      }, {
        name: 'Suriname',
        id: 'SR'
      }, {
        name: 'Svalbard and Jan Mayen',
        id: 'SJ'
      }, {
        name: 'Swaziland',
        id: 'SZ'
      }, {
        name: 'Sweden',
        id: 'SE'
      }, {
        name: 'Switzerland',
        id: 'CH'
      }, {
        name: 'Syrian Arab Republic',
        id: 'SY'
      }, {
        name: 'Taiwan, Province of China',
        id: 'TW'
      }, {
        name: 'Tajikistan',
        id: 'TJ'
      }, {
        name: 'Tanzania, United Republic of',
        id: 'TZ'
      }, {
        name: 'Thailand',
        id: 'TH'
      }, {
        name: 'Timor-Leste',
        id: 'TL'
      }, {
        name: 'Togo',
        id: 'TG'
      }, {
        name: 'Tokelau',
        id: 'TK'
      }, {
        name: 'Tonga',
        id: 'TO'
      }, {
        name: 'Trinidad and Tobago',
        id: 'TT'
      }, {
        name: 'Tunisia',
        id: 'TN'
      }, {
        name: 'Turkey',
        id: 'TR'
      }, {
        name: 'Turkmenistan',
        id: 'TM'
      }, {
        name: 'Turks and Caicos Islands',
        id: 'TC'
      }, {
        name: 'Tuvalu',
        id: 'TV'
      }, {
        name: 'Uganda',
        id: 'UG'
      }, {
        name: 'Ukraine',
        id: 'UA'
      }, {
        name: 'United Arab Emirates',
        id: 'AE'
      }, {
        name: 'United Kingdom',
        id: 'GB'
      }, {
        name: 'United States',
        id: 'US'
      }, {
        name: 'United States Minor Outlying Islands',
        id: 'UM'
      }, {
        name: 'Uruguay',
        id: 'UY'
      }, {
        name: 'Uzbekistan',
        id: 'UZ'
      }, {
        name: 'Vanuatu',
        id: 'VU'
      }, {
        name: 'Venezuela',
        id: 'VE'
      }, {
        name: 'Viet Nam',
        id: 'VN'
      }, {
        name: 'Virgin Islands, British',
        id: 'VG'
      }, {
        name: 'Virgin Islands, U.S.',
        id: 'VI'
      }, {
        name: 'Wallis and Futuna',
        id: 'WF'
      }, {
        name: 'Western Sahara',
        id: 'EH'
      }, {
        name: 'Yemen',
        id: 'YE'
      }, {
        name: 'Zambia',
        id: 'ZM'
      }, {
        name: 'Zimbabwe',
        id: 'ZW'
      }];
    }
  }


  function getEncodedImage() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkwAAAJNCAYAAADDOCpmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MkQyQkU3OTY1RTExMUU1OEFCMEQ5QUUyMjM0MEEyRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MkQyQkU3QTY1RTExMUU1OEFCMEQ5QUUyMjM0MEEyRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkyRDJCRTc3NjVFMTExRTU4QUIwRDlBRTIyMzQwQTJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkyRDJCRTc4NjVFMTExRTU4QUIwRDlBRTIyMzQwQTJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bWw5SAAA9TRJREFUeNrsvQd0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";
  }

})();
