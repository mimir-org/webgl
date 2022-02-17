let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

var boxWidth = 10;
var boxHeight = 5;
var boxDepth = 5;

var cameraFov = 35;
var cameraRad = cameraFov * Math.PI / 180;
var cameraNear = 0.1;
var cameraFar = 1000;

var cameraPosX = 0;
var cameraPosY = 0;
var cameraPosZ = (boxWidth * boxHeight) / 3;

window.addEventListener("resize", onWindowResize);
window.addEventListener("mousedown", onMouseDown);
init();

function init() {
  container = document.querySelector("#scene-container");
  scene = new THREE.Scene();
  scene.background = new THREE.Color("blue");

  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    cameraFov, // FOV
    container.clientWidth / container.clientHeight, // aspect
    cameraNear, // near clipping plane
    cameraFar // far clipping plane
  );

  camera.position.set(cameraPosX, cameraPosY, cameraPosZ);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x200020, 6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);

  hemisphereLight.position.set(0, 0, 0);
  directionalLight.position.set(0, 0, 10);

  scene.add(hemisphereLight);
  scene.add(directionalLight);
}

function createMeshes() {

  const loader = new THREE.TextureLoader();
  const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
  
  const materials = [
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform1.jpg"),side: THREE.BackSide //Right
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform2.jpg"),side: THREE.BackSide //Left
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform3.jpg"),side: THREE.BackSide //Top
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform4.jpg"),side: THREE.BackSide //Bottom
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform5.jpg"),side: THREE.BackSide //Front
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform6.jpg"),side: THREE.BackSide //Back
    }),
  ];

  //Repeating testure START
  var textureRoof = loader.load( 'resources/images/wall.jpg', function () {
    textureRoof.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
    textureRoof.offset.set( 0, 0 );
    textureRoof.repeat.set( 1, 1 );
} );

const materials2 = [
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Right
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Left
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Roof
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Floor
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Front
  new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0x111111, shininess: 10, map: textureRoof, side: THREE.BackSide} ), //Back
];

//Repeating testure END

  mesh = new THREE.Mesh(geometry, materials2);
  scene.add(mesh);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
}

function render() {
  renderer.render(scene, camera);
}

function update() {
  // mesh.rotation.z += 0.01;
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
}

function onWindowResize() {
  console.log("You resized the browser window!");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function randomColour() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function onMouseDown() {
  console.log("mouse down");
}