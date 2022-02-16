let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

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
    35, // FOV
    container.clientWidth / container.clientHeight, // aspect
    1, // near clipping plane
    100 // far clipping plane
  );

  camera.position.set(0, 0, 10);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x200020, 3);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  hemisphereLight.position.set(-50, 2, 4);
  directionalLight.position.set(-50, 2, 4);

  scene.add(hemisphereLight);
  scene.add(directionalLight);
}

function createMeshes() {
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.BoxBufferGeometry(8, 4, 4);
  
  const materials = [
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform1.jpg"),side: THREE.BackSide 
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform2.jpg"),side: THREE.BackSide 
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform3.jpg"),side: THREE.BackSide 
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform4.jpg"),side: THREE.BackSide 
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform5.jpg"),side: THREE.BackSide 
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load("resources/images/platform6.jpg"),side: THREE.BackSide 
    }),
  ];

  mesh = new THREE.Mesh(geometry, materials);
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