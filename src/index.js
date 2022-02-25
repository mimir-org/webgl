import React, { Component as WebGlComponent } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GUI } from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

const webGlContainerStyle = {
  height: 1250,
  width: 2230,
};

class App extends WebGlComponent {
  componentDidMount() {
    this.sceneSetup();
    this.sceneSkybox();
    this.sceneLights();
    this.sceneLocation();
    this.sceneLocationGridLines();
    this.sceneText("Laboratory");
    this.sceneCubeMagnus();
    this.sceneCubeErlend();
    this.sceneGuiSetup();
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

  sceneGuiSetup = () => {
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);
    this.Gui = new GUI();

    //Location
    this.GuiLocationFolder = this.Gui.addFolder("Laboratory");

    this.GuiLocationFolder.add(this.Location.geometry.parameters, "width").name(
      "Width:"
    ).domElement.style.pointerEvents = "none";

    this.GuiLocationFolder.add(this.Location.geometry.parameters, "depth").name(
      "Depth:"
    ).domElement.style.pointerEvents = "none";

    this.GuiLocationFolder.add(
      this.Location.geometry.parameters,
      "height"
    ).name("Height:").domElement.style.pointerEvents = "none";

    this.GuiLocationFolder.addColor(
      new GuiColorHelper(this.LocationLines.material, "color"),
      "value"
    )
      .name("Grid color")
      .onChange(this.sceneAnimationLoop);

    this.GuiLocationFolder.addColor(
      new GuiColorHelper(this.Location.material, "color"),
      "value"
    )
      .name("Room color")
      .onChange(this.sceneAnimationLoop);

    this.GuiLocationFolder.open();
    
    this.cameraDegree = "0";

    this.GuiCameraFolder = this.Gui.addFolder("Camera");
    this.GuiCameraFolder.add(this.camera.position, "x")
      .name("X-position:")
      .listen();
    this.GuiCameraFolder.add(this.camera.position, "y")
      .name("Y-position:")
      .listen();
    this.GuiCameraFolder.add(this.camera.position, "z")
      .name("Z-position:")
      .listen();
    this.GuiCameraFolder.add(this, "cameraDegree")
      .name("Compass:")
      .listen();

    this.GuiCameraFolder.domElement.style.pointerEvents = "none";
    this.GuiCameraFolder.open();
  };

  sceneAnimationLoop = () => {
    this.skyboxCube.position.x = this.camera.position.x;
    this.skyboxCube.position.y = this.camera.position.y;
    this.skyboxCube.position.z = this.camera.position.z;
    this.cameraDegree = this.sceneCameraDegree(false);
    compass.style.transform = `rotate(${-this.sceneCameraDegree(true)}deg)`;

    this.stats.update();

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.sceneAnimationLoop);
  };

  sceneCameraDegree = (integer) => {
    let angle = Math.atan2(this.camera.position.z, this.camera.position.x);
    angle -= Math.PI * 0.5;
    angle += angle < 0 ? Math.PI * 2 : 0;
    let degree = Math.round(THREE.MathUtils.radToDeg(angle));

    if(integer)
      return degree;

    if(degree == 0) return degree + "° N"
    else if(degree > 0 && degree < 90) return degree + "° NE";
    else if(degree == 90) return degree + "° E";
    else if(degree > 90 && degree < 180) return degree + "° SE";
    else if(degree == 180) return degree + "° S";
    else if(degree > 180 && degree < 270) return degree + "° SW";
    else if(degree == 270) return degree + "° W";
    else if(degree > 270 && degree < 360) return degree + "° NW";
    else return degree; 
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
    const geometry = new THREE.BoxGeometry(1, 1, 0.01); //w/h/d

    const material = new THREE.MeshPhongMaterial({
      map: loader.load("assets/images/magnus.png"),
      flatShading: true,
    });

    this.cubeMagnus = new THREE.Mesh(geometry, material);

    this.cubeMagnus.position.x = -1.5;
    this.cubeMagnus.position.z = -this.LocationDepth / 2;
    this.cubeMagnus.position.y = 0.3; //TODO
    this.cubeMagnus.scale.set(1, 1, 1);

    this.scene.add(this.cubeMagnus);
  };

  sceneCubeErlend = () => {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry(1, 1, 0.01); //w/h/d

    const material = new THREE.MeshPhongMaterial({
      map: loader.load("assets/images/erlend.png"),
      flatShading: true,
    });

    this.cubeErlend = new THREE.Mesh(geometry, material);

    this.cubeErlend.position.x = 1.5;
    this.cubeErlend.position.z = -this.LocationDepth / 2;
    this.cubeErlend.position.y = 0.3; //TODO
    this.cubeErlend.scale.set(1, 1, 1);

    this.scene.add(this.cubeErlend);
  };

  sceneLocation = () => {
    const geometry = new THREE.BoxGeometry(20, 2.4, 10); //w/h/d

    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.BackSide,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    this.Location = new THREE.Mesh(geometry, material);
    this.LocationWidth = this.Location.geometry.parameters.width;
    this.LocationDepth = this.Location.geometry.parameters.depth;
    this.LocationHeight = this.Location.geometry.parameters.height;

    const offsetZ = 10;
    const offsetY = 3;
    const cameraPosZ = Math.max(
      this.LocationWidth,
      this.LocationHeight,
      this.LocationDepth
    );

    this.camera.position.set(
      0,
      this.LocationHeight * offsetY,
      cameraPosZ + offsetZ
    );
    this.camera.lookAt(
      this.Location.position.x,
      this.Location.position.y,
      this.Location.position.z
    );

    this.scene.add(this.Location);
  };

  sceneText = (text) => {
    var loader = new FontLoader();
    const scene = this.scene;
    const location = this.Location;

    const locationWidth = this.LocationWidth;
    const locationHeight = this.LocationHeight;
    const locationDepth = this.LocationDepth;

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
        textGeometry.center();

        var textMaterial = new THREE.MeshPhongMaterial({
          color: 0x156289,
          specular: 0x156289,
        });

        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        const scaleFactor =
          3 / (locationWidth + locationHeight + locationDepth);
        textMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        textMesh.position.x = location.position.x; //TODO
        textMesh.position.y =
          location.position.y + locationHeight - scaleFactor; //TODO
        textMesh.position.z = location.position.z - locationDepth / 2; //TODO

        scene.add(textMesh);
      }
    );
  };

  sceneLocationGridLines = () => {
    const width = this.Location.geometry.parameters.width;
    const height = this.Location.geometry.parameters.height;
    const depth = this.Location.geometry.parameters.depth;
    const distance = 1;

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x1e8ec6,
      transparent: false,
      opacity: 0.8,
    });

    let x = -width / 2;
    let y = -height / 2;
    let z = depth / 2;

    //Lines (near -> far) wall and floor (starting near left top)
    for (let i = 0; i <= Math.ceil(width); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x + i, y + height, z)); //wall (near) top
      points.push(new THREE.Vector3(x + i, y, z)); //floor (near)
      points.push(new THREE.Vector3(x + i, y, -z)); //floor (far)
      points.push(new THREE.Vector3(x + i, y + height, -z)); //wall (far) top
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      this.LocationLines = new THREE.Line(geometry, lineMaterial);
      this.scene.add(this.LocationLines);
    }

    //Lines (left -> right) wall and floor (starting near left top)
    for (let i = 0; i < Math.ceil(depth); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x, y + height, z - i)); //top near left
      points.push(new THREE.Vector3(x, y, z - i)); //bottom near left
      points.push(new THREE.Vector3(x + width, y, z - i)); //bottom near right
      points.push(new THREE.Vector3(x + width, y + height, z - i)); //top near right
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }

    //Lines around all walls (starting near left bottom)
    for (let i = 0; i < Math.ceil(height); i += distance) {
      let points = [];
      points.push(new THREE.Vector3(x, y + i, z)); //bottom near left
      points.push(new THREE.Vector3(x + width, y + i, z)); //bottom near right
      points.push(new THREE.Vector3(x + width, y + i, z - depth)); //bottom far right
      points.push(new THREE.Vector3(x, y + i, z - depth)); //bottom far left
      points.push(new THREE.Vector3(x, y + i, z)); //bottom near left
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      this.scene.add(line);
    }
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

class GuiColorHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<WebGlContainer />, rootElement);