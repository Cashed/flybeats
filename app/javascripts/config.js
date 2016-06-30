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
    $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'javascripts/home/home.html',
        controller: 'Home',
        controllerAs: 'home'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'javascripts/authentication/login/login.html',
        controller: 'Login',
        controllerAs: 'user',
        data: {
          registrationSuccess: false
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'javascripts/authentication/register/register.html',
        controller: 'Register',
        controllerAs: 'user'
      });
  }

  function Run($rootScope, $state) {
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
        if (error.status === 401) {
          $state.go('login');
        }
      });
  }
})();
