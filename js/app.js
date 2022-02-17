let container;
let camera;
let controls;
let renderer;
let scene;
let boxMeshTexture;
let boxMeshColor;

var boxWidth = 5;
var boxHeight = 2.6;
var boxDepth = 5;

var cameraFov = 35;
var cameraRad = cameraFov * Math.PI / 180;
var cameraNear = 0.1;
var cameraFar = 1000;

var cameraPosX = 0;
var cameraPosY = 2;
var cameraPosZ = (boxWidth * boxHeight) / 1.4;

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
  directionalLight.position.set(0, 0, 0);

  scene.add(hemisphereLight);
  scene.add(directionalLight);
}

function createMeshes() {
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
  const geometry2 = new THREE.BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
  
  var textureRoof = loader.load( 'resources/images/roof.png', function () {
    textureRoof.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
    textureRoof.offset.set( 0, 0 );
    textureRoof.repeat.set( 1, 0 );
  });

  var textureWall = loader.load( 'resources/images/wall.png', function () {
    textureWall.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
    textureWall.offset.set( 0, 0 );
    textureWall.repeat.set( 1, 1 );
  });

  var textureFloor = loader.load( 'resources/images/floor.png', function () {
    textureFloor.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
    textureFloor.offset.set( 0, 0 );
    textureFloor.repeat.set( 1, 1 );
  });

const textureMaterialArray = [];
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureWall, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Right
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureWall, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Left
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureRoof, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Top
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureFloor, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Bottom
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureWall, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Front
textureMaterialArray.push(new THREE.MeshBasicMaterial( { map: textureWall, transparent: true, opacity: 0.9, side: THREE.BackSide })); //Back

const colorMaterialArray = [];
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x838587, side: THREE.BackSide })); //Right
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x838587, side: THREE.BackSide })); //Left
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x989a9b, side: THREE.BackSide })); //Top
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x757777, side: THREE.BackSide })); //Bottom
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x757777, side: THREE.BackSide })); //Front
colorMaterialArray.push(new THREE.MeshBasicMaterial( { color: 0x757777, side: THREE.BackSide })); //BAck

boxMeshTexture = new THREE.Mesh(geometry, textureMaterialArray);
boxMeshColor = new THREE.Mesh(geometry2, colorMaterialArray);

scene.add(boxMeshTexture);
scene.add(boxMeshColor);
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