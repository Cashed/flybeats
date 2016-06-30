(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .factory('UserService', UserService);

  UserService.$inject = ['$http', '$q'];

  function UserService($http, $q) {
    var service = {};

    service.getCurrent = getCurrent;
    service.getAll = getAll;
    service.getById = getById;
    service.getByUsername = getByUsername;
    service.updateUser = updateUser;
    service.deleteUser = deleteUser;

    return service;

    function getCurrent() {
      return $http
        .get('/users/current')
        .then(handleSuccess, handleError);
    }

    function getAll() {
      return $http
        .get('/users')
        .then(handleSuccess, handleError);
    }

    function getById(id) {
      return $http
        .get('/users/id/' + id)
        .then(handleSuccess, handleError);
    }

    function getByUsername(username) {
      return $http
        .get('/users/name/' + username)
        .then(handleSuccess, handleError);
    }

    function updateUser(user) {
      return $http
        .put('/users' + user.id, user)
        .then(handleSuccess, handleError);
    }

    function deleteUser(id) {
      return $http
        .delete('/users' + id)
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
