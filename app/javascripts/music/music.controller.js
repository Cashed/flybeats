(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .controller('Music', Music);

  Music.$inject = ['$scope', 'MusicService'];

  function Music($scope, MusicService) {
    var vm = this;

    vm.selectSong = function() {
      MusicService.instantiateAudioContext();
      if (vm.selected === undefined) {
        alert('please select a song');
      }
      else {
        MusicService.getSong(vm.selected).then(function() {
          // MusicService.playAudio();
        });
      }
    }
  }

})();
