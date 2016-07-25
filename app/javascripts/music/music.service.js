(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .factory('MusicService', MusicService);

  MusicService.$inject = ['$http'];

  function MusicService($http) {
    var context;
    var source, sourceJS;
    var analyser;
    var startTime;
    var data;
    var service = {};

    service.instantiateAudioContext = instantiateAudioContext;
    service.getSong = getSong;
    service.decodeAudio = decodeAudio;
    service.playAudio = playAudio;

    return service;

    function instantiateAudioContext() {
      try {
        if (typeof AudioContext === 'function') {
          context = new AudioContext();
        }
      }
      catch(e) {
        alert('Web Audio API is not supported on this browser.  Recommend Re-opening in Chrome =)');
      }
    }

    function getSong(songUrl) {
      return $http({
        method: 'GET',
        url: songUrl,
        responseType: 'arraybuffer'
      })
      .then(function(song) {
        decodeAudio(song.data);
      })
      .catch(function(error) {
        console.log(error);
      });
    }

    function decodeAudio(song){
      context.decodeAudioData(song,
        function(buffer) {
          if (!buffer) {
            alert('Error decoding file data');
            return;
          }
          sourceJS = context.createScriptProcessor(2048, 1, 1);
          sourceJS.buffer = buffer;
          sourceJS.connect(context.destination);

          analyser = context.createAnalyser();
          analyser.smootherTimeConstant = 0.6;
          analyser.fftSize = 128;

          source = context.createBufferSource();
          source.buffer = buffer;

          source.connect(analyser);
          analyser.connect(sourceJS);
          source.connect(context.destination);

          sourceJS.onaudioprocess = function(audioEvent) {
            $window.audioArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData($window.audioArray);

            boost = 0;

            for (var i = 0; i < $window.audioArray.length; i++) {
              boost += $window.audioArray[i];
            }

            boost = boost / $window.audioArray.length;
          };

          playAudio();
        },

        function(error) {
          alert('decoding error ' + error);
        });
    }

    function playAudio() {
      source.start(0);
    }
  }
})();
