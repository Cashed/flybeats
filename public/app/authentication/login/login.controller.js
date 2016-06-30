(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .controller('Login', Login);

  Login.$inject = ['$scope', '$window', '$state', 'AuthService'];

  function Login($scope, $window, $state, AuthService) {
    var vm = this;
    vm.registrationSuccess = $state.get('login').data.registrationSuccess;
    vm.loginError = false;

    vm.login = function() {
      AuthService
        .authenticate(vm.credentials)
        .then(function(response) {
          console.log(response.token);
          $window.localStorage.token = response.token;
          UserService.isLoggedIn = true;
          // $state.go('home');
        })
        .catch(function(error) {
          vm.loginError = true;
          vm.error = error.details;
        });
    }
  }
})();
