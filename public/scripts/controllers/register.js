(function() {
  'use strict';

  angular
    .module('Auth')
    .controller('Register', Register);

  Register.$inject = ['$scope'];

  function Register($scope) {
    var vm = this;

    vm.pwPattern = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/g;
  }
})();
