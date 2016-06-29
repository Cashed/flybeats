(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .controller('Register', Register);

  Register.$inject = ['$scope'];

  function Register($scope) {
    var vm = this;

    vm.pwPattern = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,20}$/g;
  }
})();
