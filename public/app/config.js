(function() {

  angular
    .module('MusicalStares')
    .config(Router);

  Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function Router($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('register', {
        url: '/',
        templateUrl: 'app/login/register.html',
        controller: 'Register',
        controllerAs: 'user'
      });
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'Login',
        controllerAs: 'user'
      });

    $locationProvider.html5Mode(true);
  }
})();
