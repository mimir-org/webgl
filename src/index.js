import React, { Component as WebGlComponent } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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
    //this.sceneLocationCompass();
    this.sceneLocationGridLines();
    this.sceneText("Laboratory");
    //this.sceneCubeMagnus();
    //this.sceneCubeErlend();
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
    const geometry = new THREE.BoxGeometry(10, 2.4, 5); //w/h/d

    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.BackSide,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
    });

    this.cubeLocation = new THREE.Mesh(geometry, material);

    this.camera.position.x = this.cubeLocation.position.x;
    this.camera.position.y = this.cubeLocation.geometry.parameters.height + 2;
    this.camera.position.z = this.cubeLocation.geometry.parameters.depth + 8; //TODO

    this.camera.lookAt(
      this.cubeLocation.position.x,
      this.cubeLocation.position.y,
      this.cubeLocation.position.z
    );

    this.scene.add(this.cubeLocation);
  };

  sceneLocationCompass = () => {
    const width = this.cubeLocation.geometry.parameters.width;
    const depth = this.cubeLocation.geometry.parameters.depth;
    const radius = (width / depth) * 5;
    const radials = 4;
    const circles = 3;
    const divisions = width + depth;
    const helper = new THREE.PolarGridHelper(
      radius,
      radials,
      circles,
      divisions
    );
    helper.position.y = -this.cubeLocation.geometry.parameters.height / 2 + 0.1;
    this.scene.add(helper);
  };

  sceneLocationGridLines = () => {
    const locationWidth = this.cubeLocation.geometry.parameters.width;
    const locationHeight = this.cubeLocation.geometry.parameters.height;
    const locationDepth = this.cubeLocation.geometry.parameters.depth;

    const x = -locationWidth / 2;
    const y = -locationHeight / 2;
    const z = locationDepth / 2;
    const distance = 1;

    //Horizontal lines along the x-axis (wall and floor)
    for (let i = 0; i <= Math.ceil(locationWidth); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x + i, y + locationHeight, z)); //wall (near) top
      points.push(new THREE.Vector3(x + i, y, z)); //floor (near)
      points.push(new THREE.Vector3(x + i, y, -z)); //floor (far)
      points.push(new THREE.Vector3(x + i, y + locationHeight, -z)); //wall (far) top
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1e8ec6,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }

    //Horizontal lines along the z-axis (wall and floor)
    for (let i = 0; i < Math.ceil(locationDepth); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x, y + locationHeight, z - i)); //top near left
      points.push(new THREE.Vector3(x, y, z - i)); //bottom near left
      points.push(new THREE.Vector3(x + locationWidth, y, z - i)); //bottom near right
      points.push(new THREE.Vector3(x + locationWidth, y + locationHeight, z - i)); //top near right

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1e8ec6,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }

    //Horizontal lines around all four walls
    for (let i = 0; i < Math.ceil(locationHeight); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x, y + i, z)); //bottom near left
      points.push(new THREE.Vector3(x + locationWidth, y + i, z)); //bottom near right
      points.push(new THREE.Vector3(x + locationWidth, y + i, z - locationDepth)); //bottom far right
      points.push(new THREE.Vector3(x, y + i, z - locationDepth)); //bottom far left
      points.push(new THREE.Vector3(x, y + i, z)); //bottom near left

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1e8ec6,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }
  };

  sceneText = (text) => {
    var loader = new FontLoader();
    let scene = this.scene;
    let cubeLocation = this.cubeLocation;

    loader.load(
      "assets/fonts/helvetiker_regular.typeface.json",
      function (font) {
        var textGeometry = new TextGeometry(text, {
          font: font,
          size: 10, // font size
          height: 1, // how much extrusion (how thick / deep are the letters)
          curveSegments: 50,
          bevelThickness: 1,
          bevelSize: 0.7,
          bevelEnabled: true,
        });

        textGeometry.computeBoundingBox();

        var textMaterial = new THREE.MeshPhongMaterial({
          color: 0x156289,
          specular: 0x156289,
        });

        let locationTextMesh = new THREE.Mesh(textGeometry, textMaterial);
        locationTextMesh.scale.set(0.1, 0.1, 0.1);

        locationTextMesh.position.x = cubeLocation.position.x - 3.5; //TODO
        locationTextMesh.position.y = cubeLocation.position.y + 1.5; //TODO
        locationTextMesh.position.z = cubeLocation.position.z - 2.8; //TODO

        scene.add(locationTextMesh);
      }
    );
  };

  sceneAnimationLoop = () => {
    // this.cubeMagnus.rotation.x -= 0.005;
    // this.cubeMagnus.rotation.y -= 0.008;

    // this.cubeErlend.rotation.x -= 0.008;
    // this.cubeErlend.rotation.y -= 0.005;

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
