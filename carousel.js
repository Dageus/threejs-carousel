
import * as THREE from "three";
//'use strict';

// TODO usar ParametricGeometry porque era demasiado tarde para eu entender como isto funciona
class Seats {
    constructor(radius, height, materialManager) {
        this.seatGroup = new THREE.Group();

        const numSeats = 8;
        const angleIncrement = (2 * Math.PI) / numSeats;

        for (let i = 0; i < numSeats; i++){
            const angle = i * angleIncrement;

            const x = radius * Math.cos(angle);
            const y = height + 2.5;
            const z = radius * Math.sin(angle);


            const material = materialManager.meshLambertMaterial.clone();
            material.color.set(Math.random() * 0xffffff);

            const seat = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5), material);
            
            seat.position.set(x, y, z); // Set position
            seat.rotation.y = angle; // Rotate seat to match angle
            seat.castShadow = true;
            seat.receiveShadow = true;

            materialManager.addObject(seat);

            this.seatGroup.add(seat);
        }

    }

}


class InnerRing {
    constructor(materialManager) {
        let material = materialManager.meshLambertMaterial.clone();
        material.color.set(new THREE.Color('red'));

        this.innerRing = new THREE.Group();
        
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
            new THREE.Vector3(0, 20, 0), // Start point (bottom)
            new THREE.Vector3(0, 30, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 15, 30, false), material);
        this.outerWall.receiveShadow = true;
        this.outerWall.castShadow = true;
        materialManager.addObject(this.outerWall);

        this.seats = new Seats(10, 30, materialManager).seatGroup;

        this.innerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }

}

class MiddleRing {
    constructor(materialManager) {
        let material = materialManager.meshLambertMaterial.clone();
        material.color.set(new THREE.Color('green'));

        this.middleRing = new THREE.Group();
        
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
            new THREE.Vector3(0, 10, 0), // Start point (bottom)
            new THREE.Vector3(0, 20, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 25, 30, false), material);
        this.outerWall.castShadow = true;
        this.outerWall.receiveShadow = true;
        materialManager.addObject(this.outerWall);
        
        this.seats = new Seats(20, 20, materialManager).seatGroup;

        this.middleRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }

}

class OuterRing {
    constructor(materialManager) {
        let material = materialManager.meshLambertMaterial.clone();
        material.color.set(new THREE.Color('blue'));

        this.outerRing = new THREE.Group();
        
        this.upperRing = new THREE.Mesh(new THREE.RingGeometry(25, 35), material);
        this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
        this.upperRing.position.y = 10;
        this.upperRing.receiveShadow = true;
        this.upperRing.castShadow = true;
        materialManager.addObject(this.upperRing);
        
        this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
        this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        this.lowerRing.position.y = 0;
        this.lowerRing.receiveShadow = true;
        this.lowerRing.castShadow = true;
        materialManager.addObject(this.lowerRing);

        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), // Start point (bottom)
            new THREE.Vector3(0, 10, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 35, 30, false), material);
        this.outerWall.castShadow = true;
        this.outerWall.receiveShadow = true;
        materialManager.addObject(this.outerWall);
        
        this.seats = new Seats(30, 10, materialManager).seatGroup;

        this.outerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }
}

class Pillar {
    constructor(materialManager) {
        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), // Start point (bottom)
            new THREE.Vector3(0, 50, 0)   // End point (top)
        ]);

        let material = materialManager.meshLambertMaterial.clone();
        material.color = new THREE.Color('yellow');
        this.pillar = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 5, 8, false), material);
        this.pillar.castShadow = true;
        this.pillar.receiveShadow = true;

        materialManager.addObject(this.pillar);
    }
}


export default class Carousel {
  constructor(materialManager) {
    this.carouselGroup = new THREE.Group();

    this.pillar = new Pillar(materialManager).pillar;

    this.outerRing = new OuterRing(materialManager).outerRing;
    this.middleRing = new MiddleRing(materialManager).middleRing; 
    this.innerRing = new InnerRing(materialManager).innerRing;

    this.carouselGroup.add(this.pillar, this.outerRing, this.middleRing, this.innerRing);
  }

}