
  // the main three.js components
  var camera, cameraOrtho, player, particleSystem, options, spawnerOptions, tick;
  var scene = new THREE.Scene();
  var clock = new THREE.Clock(true);
  // alpha sets background transparent
  var renderer = new THREE.WebGLRenderer({ alpha: true });
  var faces = ['cards/100.jpg', 'cards/101.jpg', 'cards/102.jpg', 'cards/103.jpg', 'cards/104.jpg', 'cards/105.jpg', 'cards/106.jpg', 'cards/107.jpg', 'cards/108.jpg', 'cards/109.jpg', 'cards/110.jpg'];

  var TO_RADIANS = Math.PI / 180;
  var mouse2d = new THREE.Vector2();

  // an array to store out cards in
  var cards = [];

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  init();

  function init() {
    // camera params:
    // field of view, aspect ratio for render output, near and far clipping plane
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 4000);

    // move the camera backwards so we can see stuff
    // default position is 0,0,0
    camera.position.z = 1000;
    scene.add(camera);
    camera.lookAt(scene.position);

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);


    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, -1, -1);
    scene.add(directionalLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-1, -1, 0);
    scene.add(directionalLight);

    // player
    var jsonLoader = new THREE.JSONLoader();

    // quick and dirty mesh while waiting for async
    player = new THREE.Mesh();

    jsonLoader.load('hawk.blend.json',
      function(geometry) {
        var rotation = new THREE.Matrix4().makeRotationY(Math.PI);
        geometry.applyMatrix(rotation);
        var playerMaterial = new THREE.MeshPhongMaterial({
          color: 0x3300ff,
          specular: 0x888888,
          shininess: 10,
          reflectivity: 5.5
        });
        player = new THREE.Mesh(geometry, playerMaterial);
        player.scale.set(6, 6, 6);
        player.position.z = 875;
        scene.add( player );
      });


      // the renderer's canvas dom element is added to the body

      document.body.appendChild(renderer.domElement);
      console.log(player.position);
      makeCards();
  }

  // creates a random field of card objects
  function makeCards() {
    var card, material;

    // we're gonna move from z position -1000 (far away)
    // to 1000 (where the camera is) and add a random card at every position
    var j = 1000;
    var loader = new THREE.TextureLoader();
    for (var zPos = -1000; zPos < j; zPos += 10) {
      (function(zPos) {
        loader.load(
        faces[Math.floor(Math.random() * 11)],
        function(texture) {
          material = new THREE.MeshBasicMaterial();
          material.map = texture;
          // make the card
           var geometry = new THREE.BoxGeometry(5, 8, 0.3);

           card = new THREE.Mesh(geometry, material);

          // give it a random x and y position between -500 and 500
          card.position.x = Math.random() * 1000 - 500;
          card.position.y = Math.random() * 1000 - 500;

          // set its z position
          card.position.z = zPos;

          // scale it up a bit
          card.scale.x = card.scale.y = card.scale.z = 8;

          // add it to the scene
          scene.add(card);

          // and to the array of cards
          cards.push(card);
          j++;
        })
      })(zPos);
    }
  }

  function updateCards() {
    if (typeof audioArray === 'object' && audioArray.length > 0) {
      var k = 0;
      // iterate through every card
      for (var i = 0; i < cards.length; i++) {
        var scale = (audioArray[k] + boost) / 10;
        card = cards[i];

        card.rotateX(i/3000);
        card.rotateY(i/3000);
        card.rotateZ(i/3000);

        if (i % 2 === 0) {
          card.scale.y = (scale < 1 ? 1 : scale);
        }
        else {
          card.scale.x = (scale < 1 ? 1 : scale);
        }

        k += (k < audioArray.length ? 1 : 0);

        var cardBB = new THREE.Box3();
        cardBB.setFromObject(card);

        var playerBB = new THREE.Box3();
        playerBB.setFromObject(player);

        if (cardBB.intersectsBox(playerBB)) {
          console.log('collision');
        }

        // move card forward
        card.position.z += 5;

        // if the particle is too close move it to the backward
        if (card.position.z > 1000) {
          card.position.z -= 2000;
        }
      }
    }
    var toRotX = (mouse2d.y * 30) * TO_RADIANS;
    var toRotY = ( mouse2d.x * - 30) * TO_RADIANS;
    camera.rotation.x += (toRotX - camera.rotation.x);
    camera.rotation.y += (toRotY - camera.rotation.y);
    requestAnimationFrame(updateCards);

    // render the scene from the perspective of the camera
    renderer.render(scene, camera);
  }

  function onDocumentMouseMove(event) {
    event.preventDefault();

  	mouse2d.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  	mouse2d.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    var vector = new THREE.Vector3(mouse2d.x, mouse2d.y, 0.5);
    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    if (pos.x > 500) {
      pos.x = 500;
    }
    else if (pos.x < -500) {
      pos.x = -500;
    }
    else {
      player.position.x = pos.x;
    }

    if (pos.y > 500) {
      pos.y = 500;
    }
    else if (pos.y < -500) {
      pos.y = -500;
    }
    else {
      player.position.y = pos.y;
    }

    player.position.z = 875;

  }

  updateCards();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
