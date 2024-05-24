import * as THREE from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//'use strict';

class Seats {
  constructor(radius, height, materialManager) {
    this.seatGroup = new THREE.Group();
    this.spotlights = [];

    const numSeats = 8;
    const angleIncrement = (2 * Math.PI) / numSeats;

    let shapes = [
      this.createParametricGeometry(this.sphere, 20, 20),
      this.createParametricGeometry(this.torus, 20, 20),
      this.createParametricGeometry(this.halfMoons, 20, 20),
      this.createParametricGeometry(this.klein, 20, 20),
      this.createParametricGeometry(this.cone, 20, 20),
      this.createParametricGeometry(this.butterfly, 20, 20),
      this.createParametricGeometry(this.donut, 20, 20),
      this.createParametricGeometry(this.twisted, 20, 20)
    ];

    this.rotations = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 1, 0).normalize(),
      new THREE.Vector3(0, 1, 1).normalize()
    ];

    for (let i = 0; i < numSeats; i++) {
      const angle = i * angleIncrement;

      const x = radius * Math.cos(angle);
      const y = height + 2.5;
      const z = radius * Math.sin(angle);

      const material = materialManager.meshLambertMaterial.clone();
      material.color.set(Math.random() * 0xffffff);
      material.emi


      const seat = new THREE.Mesh(shapes[i], material);

      seat.position.set(x, y + 1, z);
      seat.rotation.y = angle;
      seat.castShadow = true;
      // seat.receiveShadow = true;

      materialManager.addObject(seat);
      let spotlightObject = this.createSpotlight();

      spotlightObject.spotLight.position.set(x, height, z);
      spotlightObject.targetObject.position.set(x, y + 2, z);
      this.spotlights.push(spotlightObject.spotLight);

      this.seatGroup.add(seat, spotlightObject.spotLight, spotlightObject.targetObject);
    }

  }

  createParametricGeometry(func, uSeg, vSeg) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    for (let i = 0; i <= uSeg; i++) {
      for (let j = 0; j <= vSeg; j++) {
        const u = i / uSeg;
        const v = j / vSeg;
        
        const vertex = func(u, v);
        
        vertices.push(vertex.x, vertex.y, vertex.z);
        
        if (i < uSeg && j < vSeg) {
          const u_ = i + 1;
          const v_ = j + 1;
          const a = i + j * (vSeg + 1);
          const b = u_ + j * (vSeg + 1);
          const c = i + v_ * (vSeg + 1);
          const d = u_ + v_ * (vSeg + 1);
          
          indices.push(a, b, d, c, d, a);
        }
      }

    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // Compute t

    return geometry;
  }

  sphere = (u, v) => {
    u *= Math.PI;
    v *= 2 * Math.PI;

    const x = 3 * Math.sin(u) * Math.cos(v);
    const y = 3 * Math.sin(u) * Math.sin(v);
    const z = 3 * Math.cos(u);

    return new THREE.Vector3(x, y, z);
  }

  torus = (u, v) => {
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const x = Math.cos(u) * (2.5 * Math.cos(v));
    const y = 0.5 * Math.sin(v);
    const z = (2.5 * Math.cos(u)) * Math.sin(v);

    return new THREE.Vector3(x, y, z);
  }

  halfMoons = (u, v) => {
    // create a half moon shape 
    // u *= Math.PI; // Half the range for u (0 to π)
    v *= 2 * Math.PI; // Full range for v (0 to 2π)

    const radius = 3; // Radius of the torus
    const tubeRadius = 1; // Radius of the tube (cross-section of the torus)

    const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
    const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
    const z = tubeRadius * Math.sin(v);

    return new THREE.Vector3(x, y, z)
  }

  klein = (u, v) => {
    u *= Math.PI;
    v *= 2 * Math.PI;

    u = u * 2;
    const x = (3 + Math.cos(v)) * Math.cos(u);
    const y = (3 + Math.cos(v)) * Math.sin(u);
    const z = Math.sin(v) * 1.5;

    return new THREE.Vector3(x, y, z);
  }

  cone = (u, v) => {
    u *= 2 * Math.PI;

    const x = 4 * (1 - v) * Math.cos(u);
    const y = -4 * (1 - v)
    const z = 4 * (1 - v) * Math.sin(u);

    return new THREE.Vector3(x, y, z);
  }

  butterfly = (u, v) => {
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const x = Math.sin(u) * (Math.exp(Math.cos(v)) - 2 * Math.cos(4 * u) - Math.pow(Math.sin(v / 2), 5));
    const y = Math.cos(u) * (Math.exp(Math.cos(v)) - 2 * Math.cos(4 * u) - Math.pow(Math.sin(v / 2), 5));
    const z = Math.pow(Math.sin(u), 2) * Math.exp(Math.cos(v / 2));

    return new THREE.Vector3(x, y, z);
  }

  donut = (u, v) => {
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const x = Math.cos(u) * (3 + Math.cos(v));
    const y = Math.sin(u) * (3 + Math.cos(v));
    const z = Math.sin(v);

    return new THREE.Vector3(x, y, z);
  }

  twisted = (u, v) => {
    // create a cylinder thats twisted on the y axis
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const x = 3 * Math.sin(u) * Math.sin(v);
    const y = 3 * Math.cos(u) * Math.sin(v);
    const z = 3 * Math.cos(v);

    return new THREE.Vector3(x, y, z);
  }

  createSpotlight() {
    const spotLight = new THREE.SpotLight(new THREE.Color('white'), 500, 6);
    const targetObject = new THREE.Object3D();

    spotLight.target = targetObject;

    return { spotLight, targetObject };
  }

  applyRotations(deltaTime) {
    let j = 0;
    for (let i = 0; i < this.seatGroup.children.length; i++) {
      if (this.seatGroup.children[i].type === "Mesh") {
        this.seatGroup.children[i].rotateOnAxis(this.rotations[j], (Math.PI / 2) * deltaTime);
        j++;
      }
    }
  }

  update(deltaTime) {
    this.applyRotations(deltaTime);
  }
}


class InnerRing {
  constructor(materialManager) {
    let material = materialManager.meshLambertMaterial.clone();
    material.color.set(new THREE.Color('red'));

    this.innerRing = new THREE.Group();
    this.up = true;

    this.upperRing = new THREE.Mesh(new THREE.RingGeometry(5, 15), material);
    this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    this.upperRing.position.y = 30;
    this.upperRing.castShadow = true;
    this.upperRing.receiveShadow = true;
    materialManager.addObject(this.upperRing);

    this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(5, 15), material);
    this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.lowerRing.position.y = 20;
    this.lowerRing.castShadow = true;
    this.lowerRing.receiveShadow = true;
    materialManager.addObject(this.lowerRing);

    let path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 20, 0), 
      new THREE.Vector3(0, 30, 0)  
    ]);

    this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 15, 32, false), material);
    this.outerWall.receiveShadow = true;
    this.outerWall.castShadow = true;
    materialManager.addObject(this.outerWall);

    path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 20, 0), 
      new THREE.Vector3(0, 30, 0)
    ]);

    this.innerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 5, 32, false), material);
    this.innerWall.receiveShadow = true;
    this.innerWall.castShadow = true;
    materialManager.addObject(this.innerWall);

    this.seats = new Seats(10, 30, materialManager);
    this.spotlights = this.seats.spotlights;

    this.innerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.innerWall, this.seats.seatGroup);

    document.addEventListener("moveInnerRing", this.handleMoveInnerRing.bind(this));
  }

  handleMoveInnerRing(event) {
    this.vertical = event.detail.move;
  }

  moveHorizontally(deltaTime) {
    this.innerRing.rotation.y += deltaTime * 0.33;
  }

  moveVertically(deltaTime) {
    if (this.up) {
      this.innerRing.position.y += 10 * deltaTime;
      if (this.innerRing.position.y > 20) {
        this.up = false;
        this.innerRing.position.y = 20;
      }
    } else {
      this.innerRing.position.y -= 10 * deltaTime;
      if (this.innerRing.position.y < -20) {
        this.up = true;
        this.innerRing.position.y = -20;
      }
    }
  }

  update(deltaTime) {
    this.seats.update(deltaTime);
    this.moveHorizontally(deltaTime);
    if (this.vertical) {
      this.moveVertically(deltaTime);
    }
  }

}

class MiddleRing {
  constructor(materialManager) {
    let material = materialManager.meshLambertMaterial.clone();
    material.color.set(new THREE.Color('green'));

    this.middleRing = new THREE.Group();
    this.up = false;

    this.upperRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
    this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    this.upperRing.position.y = 20;
    this.upperRing.castShadow = true;
    this.upperRing.receiveShadow = true;
    materialManager.addObject(this.upperRing);

    this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
    this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.lowerRing.position.y = 10;
    this.lowerRing.receiveShadow = true;
    this.lowerRing.castShadow = true;
    materialManager.addObject(this.lowerRing);

    let path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 20, 0)
    ]);

    this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 25, 32, false), material);
    this.outerWall.castShadow = true;
    this.outerWall.receiveShadow = true;
    materialManager.addObject(this.outerWall);

    path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 20, 0)
    ]);

    this.innerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 15, 32, false), material);
    this.innerWall.receiveShadow = true;
    this.innerWall.castShadow = true;
    materialManager.addObject(this.innerWall);

    this.seats = new Seats(20, 20, materialManager);
    this.spotlights = this.seats.spotlights;

    this.middleRing.add(this.upperRing, this.lowerRing, this.outerWall, this.innerWall, this.seats.seatGroup);

    document.addEventListener("moveMiddleRing", this.handleMoveMiddleRing.bind(this));
  }

  handleMoveMiddleRing(event) {
    this.vertical = event.detail.move;
  }

  moveHorizontally(deltaTime) {
    this.middleRing.rotation.y += deltaTime * -0.66;
  }

  moveVertically(deltaTime) {
    if (this.up) {
      this.middleRing.position.y += 15 * deltaTime;
      if (this.middleRing.position.y > 30) {
        this.up = false;
        this.middleRing.position.y = 30;
      }
    } else {
      this.middleRing.position.y -= 15 * deltaTime;
      if (this.middleRing.position.y < -10) {
        this.up = true;
        this.middleRing.position.y = -10;
      }
    }
  }

  update(deltaTime) {
    this.seats.update(deltaTime);
    this.moveHorizontally(deltaTime);
    if (this.vertical) {
      this.moveVertically(deltaTime);
    }
  }

}

class OuterRing {
  constructor(materialManager) {
    let material = materialManager.meshLambertMaterial.clone();
    material.color.set(new THREE.Color('blue'));

    this.outerRing = new THREE.Group();
    this.up = true;

    this.upperRing = new THREE.Mesh(new THREE.RingGeometry(25, 35), material);
    this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    this.upperRing.position.y = 10;
    this.upperRing.receiveShadow = true;
    this.upperRing.castShadow = true;
    materialManager.addObject(this.upperRing);

    this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(25, 35), material);
    this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    this.lowerRing.position.y = 0;
    this.lowerRing.receiveShadow = true;
    this.lowerRing.castShadow = true;
    materialManager.addObject(this.lowerRing);

    let path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), // Start point (bottom)
      new THREE.Vector3(0, 10, 0)   // End point (top)
    ]);

    this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 35, 32, false), material);
    this.outerWall.castShadow = true;
    this.outerWall.receiveShadow = true;
    materialManager.addObject(this.outerWall);

    path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), // Start point (bottom)
      new THREE.Vector3(0, 10, 0)   // End point (top)
    ]);

    this.innerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 25, 32, false), material);
    this.innerWall.receiveShadow = true;
    this.innerWall.castShadow = true;
    materialManager.addObject(this.innerWall);

    this.seats = new Seats(30, 10, materialManager);
    this.spotlights = this.seats.spotlights;

    this.outerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.innerWall, this.seats.seatGroup);

    document.addEventListener("moveOuterRing", this.handleMoveOuterRing.bind(this));
  }

  handleMoveOuterRing(event) {
    this.vertical = event.detail.move;
  }

  moveHorizontally(deltaTime) {
    this.outerRing.rotation.y += deltaTime * 1;
  }

  moveVertically(deltaTime) {
    if (this.up) {
      this.outerRing.position.y += 20 * deltaTime;
      if (this.outerRing.position.y > 40) {
        this.up = false;
        this.outerRing.position.y = 40;
      }
    } else {
      this.outerRing.position.y -= 20 * deltaTime;
      if (this.outerRing.position.y < 0) {
        this.up = true;
        this.outerRing.position.y = 0;
      }
    }
  }

  update(deltaTime) {
    this.seats.update(deltaTime);
    this.moveHorizontally(deltaTime);
    if (this.vertical) {
      this.moveVertically(deltaTime);
    }
  }

}

class Pillar {
  constructor(materialManager) {
    let path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), // Start point (bottom)
      new THREE.Vector3(0, 50, 0)   // End point (top)
    ]);

    this.pillar = new THREE.Group();

    let material = materialManager.meshLambertMaterial.clone();
    material.color = new THREE.Color('yellow');
    this.pillarSide = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 5, 8, false), material);

    this.pillarSide.castShadow = true;
    this.pillarSide.receiveShadow = true;
    materialManager.addObject(this.pillarSide);

    this.pillarBottom = new THREE.Mesh(new THREE.CircleGeometry(5, 32), material);
    this.pillarBottom.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

    this.pillarBottom.castShadow = true;
    this.pillarBottom.receiveShadow = true;
    materialManager.addObject(this.pillarBottom);

    this.pillarTop = new THREE.Mesh(new THREE.CircleGeometry(5, 32), material);
    this.pillarTop.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    this.pillarTop.position.y = 50;
    materialManager.addObject(this.pillarTop);

    this.pillarTop.castShadow = true;
    this.pillarTop.receiveShadow = true;
    materialManager.addObject(this.pillarSide);

    this.pillar.add(this.pillarSide, this.pillarBottom, this.pillarTop);
  }

  moveHorizontally(deltaTime) {
    this.pillar.rotation.y += deltaTime;
  }

  update(deltaTime) {
    this.moveHorizontally(deltaTime);
  }

}


export default class Carousel {
  constructor(materialManager) {
    this.carouselGroup = new THREE.Group();

    this.pillar = new Pillar(materialManager);

    this.outerRing = new OuterRing(materialManager);
    this.middleRing = new MiddleRing(materialManager);
    this.innerRing = new InnerRing(materialManager);
    this.spotlights = new THREE.Group();
    this.spotlights = [];
    this.spotlights = [...this.outerRing.spotlights, ...this.middleRing.spotlights, ...this.innerRing.spotlights];

    this.carouselGroup.add(this.pillar.pillar, this.outerRing.outerRing, this.middleRing.middleRing, this.innerRing.innerRing);
  }

  update(deltaTime) {
    this.innerRing.update(deltaTime);
    this.middleRing.update(deltaTime);
    this.outerRing.update(deltaTime);
    this.pillar.update(deltaTime);
  }

}
