import * as THREE from 'three';

export default class Mobius {

  constructor() {
    this.geometry = new THREE.ParametricGeometry(this.mobius, 100, 100);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  mobius(u, v) {
    u = u * Math.PI;
    v = v * 2 * Math.PI;

    let x = Math.cos(u) * (1 + 0.5 * Math.cos(v));
    let y = Math.sin(u) * (1 + 0.5 * Math.cos(v));
    let z = 0.5 * Math.sin(v);

    return new THREE.Vector3(x, y, z);
  }

  getMesh() {
    return this.mesh;
  }

  update() {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }
}
