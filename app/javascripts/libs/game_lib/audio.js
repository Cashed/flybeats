var context;
var source, sourceJS;
var analyser;
var audioArray;
var startTime;
var score = 0;
var finalScore = 0;
var timeScore = 0;
var boost = 0;
var url = 'https://s3-us-west-2.amazonaws.com/flybeats/04+The+Glow+(feat.+Kimbra).m4a';
var bonus = new Audio('app/javascripts/libs/game_lib/10upFast3.mp3');

// loading web audio API on browsers
try {
  if (typeof AudioContext === 'function') {
    context = new AudioContext();
  }
}
catch(e) {
  // Web Audio API not supported on the browser
  alert('Web Audio API is not supported on this browser.  Recommend Re-opening in Chrome =)');
}

window.addEventListener('load', function() {
  var dropzone = document.querySelector('body');
  dropzone.addEventListener('drop', handleDrop, false);
  dropzone.addEventListener('dragover', handleDragOver, false);
});

var handleDragOver = function(e) {
  e.preventDefault();
  e.stopPropagation();
}

var handleDrop = function(e) {
  e.preventDefault();
  e.stopPropagation();

  var files = e.dataTransfer.files
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
        var data = e.target.result;
        decodeAudio(data);
    });
    reader.readAsArrayBuffer(files[0]);
  }
}

var request = new XMLHttpRequest();

// getting music data
// request.open('GET', url, true);
// placing response in an ArrayBuffer (fixed-length raw binary data)
request.responseType = 'arraybuffer';

// XMLHttpRequest Level 2: ArrayBuffer (binary data)
request.onload = function() {
  data = request.response;
  decodeAudio(data);
}

request.onerror = function() {
  alert('buffer XHR error');
}

// request.send();

function decodeAudio(data) {
  // asychronously decodes audio file data contained in arraybuffer from reponse
  context.decodeAudioData(data,
    // decoded data in buffer
    function(buffer) {
      if (!buffer) {
        alert('Error decoding file data');
        return;
      }
      // audioNode that allows javascript manipulation of audio (linked to input and output buffer)
      sourceJS = context.createScriptProcessor(2048, 1, 1);
      // add decoded buffer info as input on sourceJS
      sourceJS.buffer = buffer;
      // connect the ScriptProcessor module to the output buffer (destination = soundcard)
      sourceJS.connect(context.destination);

      // create AnalyserNode that exposes audio data, input is outputted unchanged
      analyser = context.createAnalyser();
      // average between the current buffer and the last buffer the analyser processed
      // range from (0 - 1) 0 = no time between the two, 1 = the two buffers will overlap
      // this number smoothes the changes across the AnalyserNode
      analyser.smootherTimeConstant = 0.6;
      // fft = Fast Fourier Transform, fftSize is used to determine the frequency domain
      // can be simply used to create am oscilloscope-stlyle output from audio
      analyser.fftSize = 512;

      // AudioBufferSourceNode that takes input source as ArrayBuffer and converts it to audio
      source = context.createBufferSource();
      source.onended = onEnded;
      source.buffer = buffer;

      // connect all nodes from the audio source (BufferSource) to the destination (soundcard)
      // while passing through the analyser and ScriptProcessor
      source.connect(analyser);
      analyser.connect(sourceJS);
      source.connect(context.destination);

      // creates an AudioProcessingEvent from the ScriptProcessorNode input buffer
      // we will create an array of values based on the analyser frequency data
      // in order to draw the cubes
      sourceJS.onaudioprocess = function(audioEvent) {
        // array with size of AnalyserNode's frequencyBinCount
        // which is the fftSize divided in half
        audioArray = new Uint8Array(analyser.frequencyBinCount);
        // copies current frequency data into the array
        analyser.getByteFrequencyData(audioArray);

        boost = 0;

        for (var i = 0; i < audioArray.length; i++) {
          boost += audioArray[i];
        }

        boost = boost / audioArray.length;
      };

      $('#play').click(function() {
        score = 0;
        health = 100;
        $('.score').text('Score: ' + score);
        $('.spirit-bar').animate({ width: '100%'});


        source.start(0);

        $('body').css('cursor', 'none');

        startTime = setInterval(function() {
          score += 10;
          $('.score').text('Score: ' + score);
        }, 1000);

        $('.start-screen').fadeOut();
      });

      function onEnded() {
        clearInterval(startTime);

        $('body').css('cursor', 'default');
        $('canvas').css('z-index', '0');

        $('.final-score-content').fadeIn();
        calculateScore();
        console.log('song over');
      }
    },

    function(error) {
      alert('decoding error ' + error);
    });
}

function calculateScore() {
  timeScore = score - orbBonus;
  addTime(timeScore);
  addOrbs(orbBonus);
  addSpirit(health);

  var restart = 10;
  setTimeout(function() {
    $('.play-again').text('Play again in ' + restart + ' sec.');
    restart -= 1;

    $('.final-score-content').fadeOut();
    $('.start-screen').fadeIn();
  }, 10000);

}

function addSpirit(bonus) {
  var spirit = bonus * 100;
  var addScore = setInterval(function() {
    $('.finalScore').text('Final Score: ' + finalScore);
    if (spirit >= 0) {
      $('.spiritBonus').text('Spirit Bonus: ' + spirit);

      finalScore += 100;
      spirit -= 100;

      $('.spirit-bar').animate({ width: '-=10%'});
    }
    else {
      clearInterval(addScore);
    }
  }, 10);
}

  function addOrbs(bonus) {
    var addScore = setInterval(function() {
      $('.finalScore').text('Final Score: ' + finalScore);
      if (bonus >= 0) {
        $('.orbBonus').text('Orb Bonus: ' + bonus);

        finalScore += 100;
        bonus -= 100;
      }
      else {
        clearInterval(addScore);
      }
    }, 10);
}

function addTime(bonus) {
  var addScore = setInterval(function() {
    $('.finalScore').text('Final Score: ' + finalScore);
    if (bonus >= 0) {
      $('.timeScore').text('Time Score: ' + bonus);

      finalScore += 1;
      bonus -= 1;
    }
    else {
      clearInterval(addScore);
    }
  }, 10);
}
