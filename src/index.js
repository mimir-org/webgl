import React, { Component as WebGlComponent } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const webGlContainerStyle = {
  height: 1200,
  width: 2200,
};

class App extends WebGlComponent {
  componentDidMount() {
    this.sceneSetup();
    this.sceneLights();
    this.sceneCubeLocation();
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
      1000 // far plane
    );
    
    this.camera.position.x = 0; 
    this.camera.position.y = 2;
    this.camera.position.z = 7

    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement); // mount using React ref
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
  
  sceneCubeLocation = () => {
    const geometry = new THREE.BoxGeometry(5, 2.5, 3); //w/h/d
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.BackSide,
      flatShading: true,
    });
    this.cubeLocation = new THREE.Mesh(geometry, material);
    this.scene.add(this.cubeLocation);
  };

  sceneCubeMagnus = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 1); //w/h/d
    const material = new THREE.MeshPhongMaterial({
    map: loader.load('assets/images/magnus.png'),
    flatShading: true,
    });
    this.cubeMagnus = new THREE.Mesh(geometry, material);
    this.cubeMagnus.position.x = -1;
    this.cubeMagnus.scale.set(1, 1, 1);
    this.scene.add(this.cubeMagnus);
  };

  sceneCubeErlend = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 1); //w/h/d
    const material = new THREE.MeshPhongMaterial({
    map: loader.load('assets/images/erlend.png'),
    flatShading: true,
    });
    this.cubeErlend = new THREE.Mesh(geometry, material);
    this.cubeErlend.position.x = 1;
    this.cubeErlend.scale.set(1, 1, 1);
    this.scene.add(this.cubeErlend);
  };

  sceneAnimationLoop = () => {
    this.cubeMagnus.rotation.x -= 0.005;
    this.cubeMagnus.rotation.y -= 0.008;
    
    this.cubeErlend.rotation.x -= 0.008;
    this.cubeErlend.rotation.y -= 0.005;
    
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
