import * as THREE from 'three';
import Mobius from './mobius';
import Carousel from './carousel';
import { InputManager } from './input-manager';
import { Lights, Materials } from './objects';
import { VRButton } from 'three/addons/webxr/VRButton.js';

class MainScene {
  constructor(carousel, mobiusStrip, lights, materialManager) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.resize.bind(this));

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    const material = materialManager.meshLambertMaterial.clone();
    material.color.set('steelblue');

    const box = new THREE.BoxGeometry(10, 10, 10);
    const floor = new THREE.Mesh(box, material);
    floor.scale.set(100, 0.01, 100);
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    materialManager.addObject(floor);

    mobiusStrip.position.set(0, 55, 0);
    mobiusStrip.rotateY(Math.PI / 2);
    this.scene.add(floor, lights, carousel, mobiusStrip);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(75, 90, 75);
    this.camera.lookAt(0, 0, 0);

    this.stereoCamera = new THREE.StereoCamera();
    this.stereoCamera.aspect = window.innerWidth / window.innerHeight;
    this.stereoCamera.cameraL.position.copy(this.camera.position);
    this.stereoCamera.cameraL.quaternion.copy(this.camera.quaternion);
    this.stereoCamera.cameraR.position.copy(this.camera.position);
    this.stereoCamera.cameraR.quaternion.copy(this.camera.quaternion);

    // Skydome
    const skyGeo = new THREE.SphereGeometry(200, 25, 25); 
    let loader  = new THREE.TextureLoader(),
        texture = loader.load( "space.jpeg" );

    let skydomeMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
    });

    let sky = new THREE.Mesh(skyGeo, skydomeMaterial);
    sky.rotateY(Math.PI)
    sky.material.side = THREE.BackSide;
    this.scene.add(sky);

    // vr
    document.body.appendChild( VRButton.createButton( this.renderer ) );
    this.renderer.xr.enabled = true;

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  animate() {
    if (!this.renderer.xr.isPresenting) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderer.clear();

      this.stereoCamera.aspect = window.innerWidth / window.innerHeight;

      this.stereoCamera.cameraL.position.copy(this.camera.position);
      this.stereoCamera.cameraL.quaternion.copy(this.camera.quaternion);
      this.stereoCamera.cameraR.position.copy(this.camera.position);
      this.stereoCamera.cameraR.quaternion.copy(this.camera.quaternion);

      console.log(this.stereoCamera.cameraL.position, this.camera.position);
      this.renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
      this.renderer.render(this.scene, this.stereoCamera.cameraL);

      this.renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
      this.renderer.render(this.scene, this.stereoCamera.cameraR);
    }
  }
 
  resize() {
    console.log("Update window");
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

new InputManager();
let materialManager = new Materials();  // EVERY OBJECT3D SHOULD BE ADDED TO THIS

let carousel = new Carousel(materialManager);
let mobius = new Mobius(materialManager)
let lights = new Lights(mobius.pointLights, carousel.spotlights);
let mainScene = new MainScene(carousel.carouselGroup, mobius.strip, lights.lightsGroup, materialManager);