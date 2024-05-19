import * as THREE from 'three';
import Mobius from './mobius';
import { InputManager } from './input-manager';
import { Materials } from './materials';

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

scene.add(new THREE.AmbientLight('white', 0.3));

const box = new THREE.BoxGeometry(10, 10, 10);

const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
  color: new THREE.Color('steelblue')
}));
floor.scale.set(6, 0.01, 6);
floor.position.y = -0.5;
floor.castShadow = true;
floor.receiveShadow = true;
materials.addObject(floor);
scene.add(floor)

camera.position.set(5, 2.5, 5);
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


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
