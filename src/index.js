import React, { Component as WebGlComponent } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'

const webGlContainerStyle = {
  height: 1200,
  width: 2200,
};

class App extends WebGlComponent {
  componentDidMount() {
    this.sceneSetup();
    this.sceneSkybox();
    this.sceneLights();
    this.sceneCubeLocation();
    this.sceneText();
    this.sceneCubeMagnus();
    this.sceneCubeErlend();
    this.sceneAnimationLoop();
    window.addEventListener("resize", this.windowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.windowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  sceneSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      35, // fov
      width / height, // aspect
      0.1, // near plane
      10000 // far plane
    );

    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement); // mount using React ref
  };

  sceneSkybox = () => {
    const loader = new THREE.TextureLoader();

    const material = [
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_rt.jpg"), //right
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_lf.jpg"), //left
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_up.jpg"), //top
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_dn.jpg"), //bottom
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_bk.jpg"), //front
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: loader.load("assets/images/skybox/earth_ft.jpg"), //back
        side: THREE.BackSide,
      }),
    ];

    const geometry = new THREE.BoxGeometry(5000, 5000, 5000); //w/h/d
    this.skyboxCube = new THREE.Mesh(geometry, material);
    this.skyboxCube.position.x = this.camera.position.x;
    this.skyboxCube.position.y = this.camera.position.y;
    this.skyboxCube.position.z = this.camera.position.z;
    this.scene.add(this.skyboxCube);
  };

  sceneLights = () => {
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 20, 20);
    lights[1].position.set(90, 200, 100);
    lights[2].position.set(-90, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  sceneCubeMagnus = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 1); //w/h/d
    const material = new THREE.MeshPhongMaterial({
      map: loader.load("assets/images/magnus.png"),
      flatShading: true,
    });
    this.cubeMagnus = new THREE.Mesh(geometry, material);
    this.cubeMagnus.position.x = -10;
    this.cubeMagnus.scale.set(6, 6, 6);
    this.scene.add(this.cubeMagnus);
  };

  sceneCubeErlend = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 1); //w/h/d
    const material = new THREE.MeshPhongMaterial({
      map: loader.load("assets/images/erlend.png"),
      flatShading: true,
    });
    this.cubeErlend = new THREE.Mesh(geometry, material);
    this.cubeErlend.position.x = 10;
    this.cubeErlend.scale.set(6, 6, 6);
    this.scene.add(this.cubeErlend);
  };

  sceneCubeLocation = () => {
    const geometry = new THREE.BoxGeometry(60, 10, 40); //w/h/d

    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.BackSide,
      flatShading: true,
    });

    this.cubeLocation = new THREE.Mesh(geometry, material);

    this.camera.position.x = this.cubeLocation.position.x;
    this.camera.position.y = this.cubeLocation.geometry.parameters.height;
    this.camera.position.z = this.cubeLocation.geometry.parameters.depth + this.camera.fov; //TODO
    
    this.camera.lookAt(
      this.cubeLocation.position.x,
      this.cubeLocation.position.y,
      this.cubeLocation.position.z
    );

    this.scene.add(this.cubeLocation);
  };

  sceneText = () => {
    var loader = new FontLoader();
    let scene = this.scene;
    let cubeLocation = this.cubeLocation;
    
    loader.load(
      'assets/fonts/helvetiker_regular.typeface.json',
      function (font) {
        var textGeo = new TextGeometry('Laboratory', {
          font: font,
          size: 10, // font size
          height: 1, // how much extrusion (how thick / deep are the letters)
          curveSegments: 50,
          bevelThickness: 1,
          bevelSize: 0.7,
          bevelEnabled: true,
        });
        
        textGeo.computeBoundingBox();
        
        var textMaterial = new THREE.MeshPhongMaterial({
          color: 0x156289,
          specular: 0x156289,
        });
        
        var mesh = new THREE.Mesh(textGeo, textMaterial);
        mesh.position.x = cubeLocation.position.x - 30;
        mesh.position.y = cubeLocation.position.y + 10;
        mesh.position.z = cubeLocation.position.z - 22;

        scene.add(mesh);
      }
    );
  };

  sceneAnimationLoop = () => {
    this.cubeMagnus.rotation.x -= 0.005;
    this.cubeMagnus.rotation.y -= 0.008;

    this.cubeErlend.rotation.x -= 0.008;
    this.cubeErlend.rotation.y -= 0.005;

    this.skyboxCube.position.x = this.camera.position.x;
    this.skyboxCube.position.y = this.camera.position.y;
    this.skyboxCube.position.z = this.camera.position.z;

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.sceneAnimationLoop);
  };

  windowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <div style={webGlContainerStyle} ref={(ref) => (this.mount = ref)} />
    );
  }
}

class WebGlContainer extends React.Component {
  state = { isMounted: true };
  render() {
    const { isMounted = true } = this.state;
    return (
      <>
        <button
          onClick={() =>
            this.setState((state) => ({ isMounted: !state.isMounted }))
          }
        >
          {isMounted ? "Disable WebGL" : "Enable WebGL"}
        </button>
        {isMounted && <App />}
        {isMounted && <div>Scroll to zoom, drag to rotate</div>}
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<WebGlContainer />, rootElement);
