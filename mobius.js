import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const spotLight = new THREE.SpotLight('white', 0.7);
spotLight.castShadow = true;
spotLight.position.set(0, 1, 0);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 5;
scene.add(spotLight);

scene.add(new THREE.AmbientLight('white', 0.3));

const camera = new THREE.PerspectiveCamera();
camera.position.setScalar(4);
camera.lookAt(scene.position);
new THREE.OrbitControls(camera, renderer.domElement);

const count = 256;
const box = new THREE.BoxGeometry();
const radius = 1.1;
const strip = new THREE.Object3D();
scene.add(strip)
for (let i = 0; i < count; i++) {
  const a = Math.PI / count * 2 * i;
  const o = new THREE.Object3D();
  o.position.set(Math.cos(a), Math.sin(a * 5) / 30, Math.sin(a))
  o.position.multiplyScalar(radius);
  o.lookAt(scene.position);
  strip.add(o);
  const mat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(`hsl(${a * 360 / Math.PI},55%,55%)`)
  });
  const mesh = new THREE.Mesh(box, mat);
  mesh.scale.set(0.03, 0.3, 0.001)
  mesh.castShadow = true;
  //mesh.receiveShadow  = true;
  mesh.rotation.x = a / 2;
  o.add(mesh)
}

const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
  color: new THREE.Color('steelblue')
}));
floor.scale.set(6, 0.01, 6);
floor.position.y = -0.5;
floor.castShadow = true;
floor.receiveShadow = true;
scene.add(floor)

requestAnimationFrame(function render(t) {
  if (renderer.width !== innerWidth || renderer.height !== innerHeight) {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  strip.rotation.y += 0.001;
  strip.traverse(o => {
    o.material && (o.rotation.x += 0.01)
  })
  renderer.render(scene, camera);
  requestAnimationFrame(render);
});
