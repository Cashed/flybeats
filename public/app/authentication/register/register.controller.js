(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .controller('Register', Register);

  Register.$inject = ['$scope', '$state', 'AuthService'];

  function Register($scope, $state, AuthService) {
    var vm = this;

    vm.pwPattern = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/g;
    vm.registrationError = false;

    vm.register = function() {
      AuthService
        .register(vm.newUser)
        .then(function(user) {
          $state.get('login').data.registrationSuccess = true;
          $state.go('login');
        })
        .catch(function(error) {
          vm.registrationError = true;
          vm.error = error.detail;
        });

    }
  }
})();
