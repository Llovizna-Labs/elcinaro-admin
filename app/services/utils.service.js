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
      item: {}
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

})();
