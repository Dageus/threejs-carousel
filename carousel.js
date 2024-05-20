
import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
//'use strict';

// TODO usar ParametricGeometry porque era demasiado tarde para eu entender como isto funciona
class Seats {
    constructor(radius, height) {
        this.seatGroup = new THREE.Group();

        const numSeats = 8;
        const angleIncrement = (2 * Math.PI) / numSeats;

        for (let i = 0; i < numSeats; i++){
            const angle = i * angleIncrement;

            const x = radius * Math.cos(angle);
            const y = height + 2.5;
            const z = radius * Math.sin(angle);


            const material = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff,
            });

            const seat = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 5), material);
            
            seat.position.set(x, y, z); // Set position
            seat.rotation.y = angle; // Rotate seat to match angle

            this.seatGroup.add(seat);
        }

    }

}


class InnerRing {
    constructor() {
        const material = new THREE.MeshBasicMaterial({
            color: THREE.Color.NAMES.red,
        });
        this.innerRing = new THREE.Group();
        
        this.upperRing = new THREE.Mesh(new THREE.RingGeometry(5, 15), material);
        this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
        this.upperRing.position.y = 30;
        
        this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(5, 15), material);
        this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        this.lowerRing.position.y = 20;

        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 20, 0), // Start point (bottom)
            new THREE.Vector3(0, 30, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 15, 30, false), material);

        this.seats = new Seats(10, 30).seatGroup;

        this.innerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }

}

class MiddleRing {
    constructor() {
        const material = new THREE.MeshBasicMaterial({
            color: THREE.Color.NAMES.green,
        });
        this.middleRing = new THREE.Group();
        
        this.upperRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
        this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
        this.upperRing.position.y = 20;
        
        this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
        this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        this.lowerRing.position.y = 10;

        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 10, 0), // Start point (bottom)
            new THREE.Vector3(0, 20, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 25, 30, false), material);
        
        this.seats = new Seats(20, 20).seatGroup;

        this.middleRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }

}

class OuterRing {
    constructor() {
        const material = new THREE.MeshBasicMaterial({
            color: THREE.Color.NAMES.blue,
        });
        this.outerRing = new THREE.Group();
        
        this.upperRing = new THREE.Mesh(new THREE.RingGeometry(25, 35), material);
        this.upperRing.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
        this.upperRing.position.y = 10;
        
        this.lowerRing = new THREE.Mesh(new THREE.RingGeometry(15, 25), material);
        this.lowerRing.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        this.lowerRing.position.y = 0;

        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), // Start point (bottom)
            new THREE.Vector3(0, 10, 0)   // End point (top)
        ]);

        this.outerWall = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 35, 30, false), material);
        
        this.seats = new Seats(30, 10).seatGroup;

        this.outerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats);
    }

}

class Pillar {
    constructor(materialManager) {
        let path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), // Start point (bottom)
            new THREE.Vector3(0, 50, 0)   // End point (top)
        ]);

        let material = materialManager.meshLambertMaterial;
        material.color = new THREE.Color('red');
        this.pillar = new THREE.Mesh(new THREE.TubeGeometry(path, 20, 5, 8, false), material);
        materialManager.addObject(this.pillar);
    }
}


class Carousel {
  constructor(materialManager) {
    this.carouselGroup = new THREE.Group();

    this.pillar = new Pillar(materialManager).pillar;

    this.outerRing = new OuterRing().outerRing;
    this.middleRing = new MiddleRing().middleRing; 
    this.innerRing = new InnerRing().innerRing;

    this.carouselGroup.add(this.pillar, this.outerRing, this.middleRing, this.innerRing);
  }

}

export default Carousel;