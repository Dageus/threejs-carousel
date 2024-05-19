import * as THREE from 'three';
import MobiusStrip from './mobius';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const spotLight = new THREE.SpotLight('white', 0.7);
spotLight.castShadow = true;
spotLight.position.set(0, 1, 0);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 5;
scene.add(spotLight);

scene.add(new THREE.AmbientLight('white', 0.3));


const box = new THREE.BoxGeometry();
const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
  color: new THREE.Color('steelblue')
}));
floor.scale.set(6, 0.01, 6);
floor.position.y = -0.5;
floor.castShadow = true;
floor.receiveShadow = true;
scene.add(floor)

camera.position.z = 5;

const mobius = new MobiusStrip(scene, box);


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
// Path: mobius.js
