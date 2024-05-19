import * as THREE from 'three';

export default function Mobius(scene, box) {

  function MobiusSpotlight(scene) {
    const spotLight = new THREE.SpotLight('white', 0.7);
    spotLight.castShadow = true;
    spotLight.position.set(0, 1, 0);
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 5;
    scene.add(spotLight);
  }

  function MobiusStrip(scene, box) {

    const count = 256;
    const radius = 1.1;
    this.strip = new THREE.Object3D();
    scene.add(this.strip);
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


  this.MobiusStrip = new MobiusStrip(scene, box);
  this.Spotlight = new MobiusSpotlight(scene);
}
