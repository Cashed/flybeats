(function() {

  angular
    .module('MusicalStares')
    .config(Router);

  Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function Router($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.html'
        // controller: 'Login',
        // controllerAs: 'user'
      // })
      // .state('home', {
      //   url: '/',
      //   templateUrl: 'javascripts/home/home.html',
      //   controller: 'Community',
      //   controllerAs: 'community'
      });

    $locationProvider.html5Mode(true);
  }
})();
