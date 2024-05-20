import * as THREE from 'three';

export default class Mobius {
  constructor(materialManager) {
    this.ponctualLights = new THREE.Group();

    const count = 256 * 2;
    const radius = 17;
    const box = new THREE.BoxGeometry(10, 10, 10);
    this.strip = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const a = Math.PI / count * 2 * i;

      // Add ponctual light
      if (i % (count / 8) === 0) {
        console.log("Created ponctual light");
        let ponctualLight = this.createPonctualLight();
        ponctualLight.position.set(Math.cos(a), Math.sin(a * 5) / 30, Math.sin(a));
        this.ponctualLights.add(ponctualLight);
      }

      const o = new THREE.Object3D();
      o.position.set(Math.cos(a), Math.sin(a * 5) / 30, Math.sin(a))
      o.position.multiplyScalar(radius);
      o.lookAt(0, 0, 0);
      this.strip.add(o);
      const mat = materialManager.meshLambertMaterial.clone();
      mat.color.set(new THREE.Color(`hsl(${a * 360 / Math.PI},55%,55%)`));
      const mesh = new THREE.Mesh(box, mat);
      mesh.scale.set(0.03, 0.3, 0.001)
      mesh.castShadow = true;
      mesh.receiveShadow  = true;
      mesh.rotation.x = a / 2;
      o.add(mesh)
      materialManager.addObject(mesh);
    }
    this.strip.add(this.ponctualLights);
  }

  createPonctualLight() {
    const pointLight = new THREE.PointLight(0xff0000, 1, 150);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 50;
    return pointLight;
  }
}
