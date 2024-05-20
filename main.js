import * as THREE from 'three';
import Mobius from './mobius';
import Carousel from './carousel';
import { InputManager } from './input-manager';
import { Lights, Materials } from './objects';

class MainScene {
  constructor(carousel, lights, materialManager) {
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

    const box = new THREE.BoxGeometry(10, 10, 10);

    const material = materialManager.meshLambertMaterial.clone();
    material.color.set('steelblue');

    const floor = new THREE.Mesh(box, material);
    floor.scale.set(100, 0.01, 100);
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    materialManager.addObject(floor);

    this.scene.add(floor, lights, carousel)

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(75, 90, 75);
    this.camera.lookAt(0, 0, 0);

    this.animate = this.animate.bind(this);
  }

  animate() {
    let deltaTime = this.clock.getDelta();
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
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

let lights = new Lights();
let carousel = new Carousel(materialManager);
let mainScene = new MainScene(carousel.carouselGroup, lights.lightsGroup, materialManager);
mainScene.animate();