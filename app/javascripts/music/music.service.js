(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .factory('MusicService', MusicService);

  MusicService.$inject = ['$http'];

  function MusicService($http) {
    var currentSong;
    var audioContext;
    var service = {};

    function getSong(songUrl) {
      return $http
        .get(
          'https://s3-us-west-2.amazonaws.com/flybeats/demo.wav',
          { responseType: 'arraybuffer' })
        .then(function(song) {
          analyzeSong(song);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function analyzeSong(song){
      
    }
  }
})();
