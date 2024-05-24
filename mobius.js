import * as THREE from 'three';


export default class Mobius {
  constructor(materialManager) {
    this.pointLights = [];
    const width = 2.5;
    const segments = 256 * 2;
    const radius = 20;
    this.strip = new THREE.Object3D();

    const vertices = [];
    const indices = [];
    const normals = [];

    for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
            const u = i / segments * Math.PI * 2;
            const v = j / segments * 2 - 1;
            const phi = u / 2;

            const x = radius * Math.cos(u) + width * v * Math.cos(phi) * Math.cos(u);
            const y = radius * Math.sin(u) + width * v * Math.cos(phi) * Math.sin(u);
            const z = width * v * Math.sin(phi);

            vertices.push(x, y, z);
            normals.push(x, y, z);
            
            if (i % (segments / 8) === 0 && j === segments / 2) {
              let pointLight = this.createPonctualLight();
              pointLight.position.set(x, y, z);
              this.pointLights.push(pointLight);
              this.strip.add(pointLight);
            }
            if (i < segments && j < segments) {
                const a = i * (segments + 1) + j;
                const b = a + segments + 1;
                indices.push(a, b, a + 1);
                indices.push(b, b + 1, a + 1);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    const material = materialManager.meshLambertMaterial.clone();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    materialManager.addObject(mesh);

    this.strip.add(mesh);
    this.strip.rotateZ(Math.PI / 2);
}


  createPonctualLight() {
    const pointLight = new THREE.PointLight(new THREE.Color('white'), 25, 10);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 50;
    return pointLight;
  }
}
