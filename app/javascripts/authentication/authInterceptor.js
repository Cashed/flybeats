(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$window'];

  function AuthInterceptor($window) {
    return {
      request: function(config) {
        if ($window.localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
        }
        return config;
      }
    }
  }
})();
