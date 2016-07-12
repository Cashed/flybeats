(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .config(Router)
    .run(Run);

  Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function Router($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/javascripts/home/home.html',
        controller: 'Home',
        controllerAs: 'home'
      });
  }

  function Run($http, $rootScope, $window) {
    // add JWT token as default auth header
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken.token;
  }

  // manually bootstrap angular after the JWT token is retrieved
  $(function() {
    //get JWT token from stateProvider
    $.get('/app/token', token => {
      window.jwtToken = token;

      angular.bootstrap(document, ['MusicalStares']);
    });
  });
})();
