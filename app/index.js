'use strict';

require('!!file-loader?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const uiBootstrap = require('angular-ui-bootstrap');
const angularRoute = require('angular-route');
const pingPongApp = angular.module('pingPongApp', [angularRoute, uiBootstrap]);

pingPongApp.run(['$rootScope', ($rs) => {
  $rs.baseUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
}]);

require('./controllers')(pingPongApp);
require('./components')(pingPongApp);

pingPongApp.config(['$routeProvider', '$locationProvider', ($rp, $lp) => {
  $lp.hashPrefix('');
  $rp
    .when('/home', {
      template: require('./html/home.html')
    })
    .when('/stats', {
      template: require('./html/stats.html')
    })
    .when('/update', {
      template: require('./html/update.html')
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);
