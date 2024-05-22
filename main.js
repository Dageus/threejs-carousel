import * as THREE from 'three';
import Mobius from './mobius';
import Carousel from './carousel';
import { InputManager } from './input-manager';
import { Lights, Materials } from './objects';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/Addons.js';

class MainScene {
  constructor(carousel, mobiusStrip, lights, materialManager) {
    "use strict";
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.resize.bind(this));

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.cameraGroup = new THREE.Group();

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
    this.cameraGroup.add(this.camera);
    this.cameraGroup.position.set(75, 90, 75);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.cameraGroup);

    this.originalCameraPosition = this.cameraGroup.position.clone();
    this.originalCameraRotation = this.cameraGroup.rotation.clone();

    // Skydome
    const skyGeo = new THREE.SphereGeometry(200, 25, 25);
    let loader = new THREE.TextureLoader(),
      texture = loader.load("space.jpeg");

    let skydomeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    let sky = new THREE.Mesh(skyGeo, skydomeMaterial);
    sky.rotateY(Math.PI)
    sky.material.side = THREE.BackSide;
    this.scene.add(sky);

    // vr
    document.body.appendChild(VRButton.createButton(this.renderer));
    this.renderer.xr.enabled = true;
    this.renderer.xr.setReferenceSpaceType( 'local' );
    this.sessionEnded = false;

    this.renderer.xr.addEventListener('sessionend', this.onSessionEnd.bind(this));
    this.renderer.xr.addEventListener('sessionstart', this.onSessionStart.bind(this));
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  animate() {
    "use strict";

    if (this.sessionEnded) {
      this.sessionEnded = false;
      this.resize();
    }
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    console.log("Update window");
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
  onSessionStart() {
    this.cameraGroup.rotateY(Math.PI / 4);
    this.cameraGroup.position.set(75, 1.6, 75);
  }

  onSessionEnd() {
    this.cameraGroup.position.set(this.originalCameraPosition.x, this.originalCameraPosition.y, this.originalCameraPosition.z);
    this.cameraGroup.rotation.set(this.originalCameraRotation.x, this.originalCameraRotation.y, this.originalCameraRotation.z);
    this.camera.fov = 75;
    this.camera.near = 0.1;
    this.camera.far = 1000;
    this.camera.lookAt(0, 0, 0);
    
    this.sessionEnded = true;
  }
}

new InputManager();
let materialManager = new Materials();  // EVERY OBJECT3D SHOULD BE ADDED TO THIS

let carousel = new Carousel(materialManager);
let mobius = new Mobius(materialManager)
let lights = new Lights(mobius.pointLights, carousel.spotlights);
let mainScene = new MainScene(carousel.carouselGroup, mobius.strip, lights.lightsGroup, materialManager);
