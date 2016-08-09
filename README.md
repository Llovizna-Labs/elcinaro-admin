# Gulp + AngularJS - 2.0
Este stack permite empezar un proyecto de Front-end con AngularJS rápidamente. La estructura de los archivos de Angular, las vistas y los estilos ya está definida. También las tareas más esenciales de Gulp.

## Librerías que incluye el stack
* Angular
* Angular Sanitize
* Angular Cookies
* Angular UI Router
* jQuery
* Lodash
* Bootstrap

## Actualizar las librerías del Front-end
La gestión de las librerías se hace a través de `bower`, por defecto todas las librerías que incluye el stack están configuradas para trabajar con su última versión disponible. Sin embargo, esto puede causar problemas de dependencia o compatibilidad, por lo tanto se sugiere fijar las versiones manualmente en el archivo `bower.json` o ejecutar el comando `bower update --save` para actualizar y guardar las últimas versiones disponibles.

## Actualizar las librerías de desarrollo
Le gestión de estas librerías se lleva a cabo usando `npm`, en esencia son utilizadas para construir las tareas de `gulp`. Al igual que con las librerías de Front-end, todas se encuentran configuradas por defecto en su última versión. Con el fin de evitar problemas de dependencia o compatibilidad, se recomienda fijar las versiones manualmente en el archivo `package.json` o ejecutar el comando `npm update --save` para actualizar y guardar las últimas versiones disponibles.

## Visualizando la aplicación
Inicialmente se debe ejecutar `npm install` y `bower install` para instalar las dependencias elementales del stack.

###server
El stack incluye varias tareas definidas en Gulp que generan el sitio en un estado de producción en el directorio `www/`. Por defecto al ejecutar `gulp` en la CLI las tareas definidas se encargarán de generar el sitio, con calidad de producción, en el directorio `www/`. También se puede ejecutar `gulp server` para correr un servidor web sencillo con el fin de servir nuestra aplicación.

###watch
Adicionalmente, es posible ejecutar `gulp watch` con el fin de actualizar los cambios del código automáticamente haciendo uso de Livereload. Esto permite agilizar el flujo de desarrollo, sin necesidad de preocuparse por ejecutar tareas repetitivas. Es importante destacar, que durante este proceso no se monitorean cambios en las librerías de vendors, pues esto no es común el flujo de desarrollo del día a día. Si hay un cambio o se agrega una nueva librería, simplemente se debe ejecutar `gulp watch` de nuevo.

## Agregar un nuevo LESS
Se puede agregar un archivo LESS cuando se desarrolle un componente que requiere estilos particulares. Esto es común cuando se crean directivas para encerrar componentes visuales y funcionales específicos. 

Es necesario tener en cuenta que al agregar un nuevo archivo LESS se debe agregar una referencia en `app.less`, dejando el archivo `media.less` ya que este contiene las reglas que van a sobrescribir la base para permitir una aplicación responsive.

```
@import 'fonts.less';
@import 'base.less';
@import 'colors.less';
@import 'public.less';
// Agregar siempre en la línea anterior al archivo media.less
@import 'media.less';
```

## Agregar una librería
Al agregar una nueva librería de cualquier vendor. Se debe modificar la variable `vendorScripts` o `vendorStyless` del `gulpfile` para incluir su referencia. Por defecto estos son los valores que incluye el stack.

```
var vendorScripts = [
  'app/vendors/jquery/dist/jquery.min.js',
  'app/vendors/angular/angular.min.js',
  'app/vendors/angular-sanitize/angular-sanitize.min.js',
  'app/vendors/angular-cookies/angular-cookies.min.js',
  'app/vendors/angular-ui-router/release/angular-ui-router.min.js',
  'app/vendors/lodash/lodash.min.js',
  'app/vendors/bootstrap/dist/js/bootstrap.min.js'
];
var vendorStyles = [
  'app/vendors/bootstrap/dist/css/bootstrap.min.css'
];

```
