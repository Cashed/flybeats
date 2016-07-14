var camera, scene, renderer, controls, container, options,
    spawnerOptions, particleSystem, playerBB, cubeBB, sphereBB;
var tick = 0;
var clock = new THREE.Clock(true);
var mouse = new THREE.Vector2();
var TO_RADIANS = Math.PI / 180;
var SPEED = 5;
var cubes = [];
var spheres = [];
var health = 100;
var orbBonus = 0;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();

animate();

function init() {
  scene = new THREE.Scene();

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .1, 10000);
  camera.position.z = 1000;

  var light = new THREE.DirectionalLight(0x555555);
  light.position.set(20, 40, 2000);
  light.target.position.copy(scene.position);
  light.castShadow = true;
  light.shadow.camera.left = -60;
  light.shadow.camera.top = -60;
  light.shadow.camera.right = 60;
  light.shadow.camera.bottom = 60;
  light.shadow.camera.near = 20;
  light.shadow.camera.far = 200;
  light.shadow.bias = -.0001
  light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
  scene.add(light);

  // player
  var jsonLoader = new THREE.JSONLoader();

  // quick and dirty mesh while waiting for async
  player = new THREE.Mesh();

  jsonLoader.load('app/javascripts/libs/game_lib/hawk.blend.json',
    function(geometry) {
      // rotate model to correct orientation
      var rotation = new THREE.Matrix4().makeRotationY(Math.PI);
      geometry.applyMatrix(rotation);

      var playerMaterial = new THREE.MeshPhongMaterial({
        color: 0x3300ff,
        specular: 0x888888,
        shininess: 10,
        reflectivity: 5.5,
        emissive: 0x3300ff
      });

      player = new THREE.Mesh(geometry, playerMaterial);
      player.scale.set(6, 6, 6);
      player.position.z = 875;
      player.receiveShadow = false;

      scene.add( player );
    });

  // player model particle effects
  particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 250000
  });

  scene.add( particleSystem);

  // options passed during each spawned
  options = {
    position: new THREE.Vector3(-1, 0, 875),
    positionRandomness: 10,
    velocity: new THREE.Vector3(0, -5, 0),
    velocityRandomness: 10,
    color: 0x3300ff,
    colorRandomness: 0,
    turbulence: .1,
    lifetime: 1,
    size: 12,
    sizeRandomness: 1
  };

  spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 0,
    verticalSpeed: 0,
    timeScale: 1
  }

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  makeCubes();
  makeHealth();
  requestAnimationFrame(render);

  // gradual speed increase
  // setInterval(function() {
  //   SPEED++;
  //   console.log('speed increased ' + SPEED);
  // }, 15000);

}

function makeHealth() {
  var sphere, material;

  for (var zPos = -1000; zPos < 1000; zPos += 1000) {
    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 1,
      reflectivity: 5.5
    });

    var geometry = new THREE.SphereGeometry();

    sphere = new THREE.Mesh(geometry, material);

    // give it a random x and y position between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // set its z position
    sphere.position.z = zPos;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = sphere.scale.z = .5;

    sphere.castShadow = true;
    sphere.receiveShadow = true;

    // add it to the scene
    scene.add(sphere);

    // and to the array of spheres
    spheres.push(sphere);

  }
}


function makeCubes() {
  var cube, material;

  // we're gonna move from z position -1000 (far away)
  // to 1000 (where the camera is) and add a random cube at every position
  for (var zPos = -1000; zPos < 1000; zPos += 30) {
    // make a cube material and pass through the colour
    // and custom cube render function
    material = new THREE.MeshPhongMaterial({
      color: 0x303030,
      specular: 0xffffff,
      shininess: 1,
      reflectivity: 5.5
    });

    // make the cube
    var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

    cube = new THREE.Mesh(geometry, material);

    // give it a random x and y position between -500 and 500
    cube.position.x = Math.random() * 1000 - 500;
    cube.position.y = Math.random() * 1000 - 500;

    // set its z position
    cube.position.z = zPos;

    // scale it up a bit
    cube.scale.x = cube.scale.y = cube.scale.z = 10;

    cube.castShadow = true;
    cube.receiveShadow = true;

    // add it to the scene
    scene.add(cube);

    // and to the array of cubes
    cubes.push(cube);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateBodies() {
  // wait for music
  if (typeof audioArray === 'object' && audioArray.length > 0) {
    // audioArray index
    var k = 0;

    // iterate through every cube
    for (var i = 0; i < cubes.length; i++) {
      // assign scale size from frequency
      var scale = audioArray[k] + boost / 100;

      cube = cubes[i];

      if (i < spheres.length) {
        sphere = spheres[i];

        // reset color on cube in case of collision
        sphere.material.emissive.setHex(0xaaaaff);

        // create bounding box on sphere
        sphereBB = new THREE.Box3();
        sphereBB.setFromObject(sphere);

        // check for collision
        if (sphereBB.intersectsBox(playerBB)) {
          sphere.material.emissive.setHex(0x0000ff);

          bonus.play();
          score += 100;
          orbBonus += 100;
        }

        sphere.position.z += SPEED;

        // if the sphere is too close move it to the back
        if (sphere.position.z > 1000) {
          sphere.position.y = Math.random() * 1000 - 500;
          sphere.position.x = Math.random() * 1000 - 500;
          sphere.position.z -= 2000;
        }
      }

      // reset color on cube in case of collision
      cube.material.emissive.setHex(0x000000);

      cube.rotateX(i/3000);
      cube.rotateY(i/3000);
      cube.rotateZ(i/3000);


      // distribute scale changes on both x and y axis
      if (i % 2 === 0) {
        cube.scale.y = (scale < 1 ? 1 : scale);
      }
      else {
        cube.scale.x = (scale < 1 ? 1 : scale);
      }

      // keep within bounds of audioArray
      k += (k < audioArray.length ? 1 : 0);

      // change cube color depending on scale
      if (cube.scale.y > 125 || cube.scale.x > 125) {
         cube.material.color.setHex(0x008888);
      }
      else if (cube.scale.y <= 125 && cube.scale.y > 100
       || cube.scale.x <= 125 && cube.scale.x > 100){
         cube.material.color.setHex(0x0000ff);
      }
      else if (cube.scale.y <= 100 && cube.scale.y > 2
       || cube.scale.x <= 100 && cube.scale.x > 2){
         cube.material.color.setHex(0xff00ff);
      }
      else {
         cube.material.color.setHex(0x303030);
      }

      // create bounding box on cube
      cubeBB = new THREE.Box3();
      cubeBB.setFromObject(cube);

      // check for collision
      if (cubeBB.intersectsBox(playerBB)) {
        cube.position.y -= 20;
        cube.position.z -= 20;
        cube.material.emissive.setHex(0xff0000);

        if (health > 0) {
          health--;
          $('.spirit-bar').animate({ width: `${health}%` })
        }
      }

      // move cube forward
      cube.position.z += SPEED;

      // if the cube is too close move it to the back
      if (cube.position.z > 1000) {
        cube.position.y = Math.random() * 1000 - 500;
        cube.position.z -= 2000;
      }
    }
  }
}

function animate() {
  updateBodies();

  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if (tick < 0) tick = 0;
  if (delta > 0) {
    for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
      // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
      // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
      particleSystem.spawnParticle(options);
    }
  }
  particleSystem.update(tick);

  // change camera angle with mouse
  var toRotX = (mouse.y * 30) * TO_RADIANS;
  var toRotY = ( mouse.x * - 30) * TO_RADIANS;
  camera.rotation.x += (toRotX - camera.rotation.x);
  camera.rotation.y += (toRotY - camera.rotation.y);

  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // control player model with cursor
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = - camera.position.z / dir.z;
  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

  // keep player model within range of obstacle paths
  // and update particle trail to follow model
  if (pos.x > 500) {
    pos.x = options.position.x = 500;
  }
  else if (pos.x < -500) {
    pos.x = options.position.x = -500;
  }
  else {
    player.position.x = options.position.x = pos.x;
  }

  if (pos.y > 500) {
    pos.y = options.position.y = 500;
  }
  else if (pos.y < -500) {
    pos.y = options.position.y = -500;
  }
  else {
    player.position.y = options.position.y = pos.y;
  }

  options.position.x -= 1;
  player.position.z = options.position.z = 875;

  // create bounding box on player
  playerBB = new THREE.Box3();
  playerBB.setFromObject(player);

}
