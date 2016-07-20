(function() {
  'use strict';

  angular
    .module('MusicalStares')
    .controller('Home', Home);

  Home.$inject = ['$scope'];

  function Home($scope) {
    var vm = this;
    var urls = [
      'https://s3-us-west-2.amazonaws.com/flybeats/04+The+Glow+(feat.+Kimbra).m4a',
      'https://s3-us-west-2.amazonaws.com/flybeats/03+Tessellate.m4a',
      'https://s3-us-west-2.amazonaws.com/flybeats/Grimes+-+Oblivion.mp3',
      'https://s3-us-west-2.amazonaws.com/flybeats/02+The+Mollusk.m4a',
      'https://s3-us-west-2.amazonaws.com/flybeats/demo.wav'
    ];

    vm.getSong = function() {

    }

  }
})();
