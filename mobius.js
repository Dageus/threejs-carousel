import * as THREE from 'three';

export default function MobiusStrip(scene, box) {

  const count = 256;
  const radius = 1.1;
  this.strip = new THREE.Object3D();
  scene.add(this.strip)
  for (let i = 0; i < count; i++) {
    const a = Math.PI / count * 2 * i;
    const o = new THREE.Object3D();
    o.position.set(Math.cos(a), Math.sin(a * 5) / 30, Math.sin(a))
    o.position.multiplyScalar(radius);
    o.lookAt(scene.position);
    this.strip.add(o);
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


}
