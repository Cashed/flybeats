(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['$http', '$q'];

  function AuthService($http, $q) {
    var service = {};

    var isLoggedIn = false;

    service.register = register;
    service.authenticate = authenticate;

    return service;

    function register(user) {
      return $http
        .post('/auth/register', user)
        .then(handleSuccess, handleError);
    }

    function authenticate(user) {
      return $http
        .post('/auth/authenticate', user)
        .then(handleSuccess, handleError);
    }

    //helper functions

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }
  }
})();
