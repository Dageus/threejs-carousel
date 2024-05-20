import * as THREE from 'three';
import Mobius from './mobius';
import Carousel from './carousel';
import { InputManager } from './input-manager';
import { Lights, Materials } from './objects';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


new InputManager();
let materials = new Materials();

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const mobius = new Mobius(scene, new THREE.BoxGeometry());
const carousel = new Carousel();
scene.add(carousel.carouselGroup);

scene.add(new THREE.AmbientLight('white', 0.3));

const box = new THREE.BoxGeometry(10, 10, 10);

const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
  color: new THREE.Color('steelblue')
}));
floor.scale.set(100, 0.01, 100);
floor.position.y = -0.5;
floor.castShadow = true;
floor.receiveShadow = true;
materials.addObject(floor);
scene.add(floor)

camera.position.set(75, 90, 75);
camera.lookAt(0, 0, 0);

requestAnimationFrame(function render(t) {
  if (renderer.width !== innerWidth || renderer.height !== innerHeight) {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  //mobius.strip.rotation.y += 0.001;
  //mobius.strip.traverse(o => {
  //  o.material && (o.rotation.x += 0.01)
  //})
  renderer.render(scene, camera);
  requestAnimationFrame(render);
});

let lights = new Lights(scene);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
