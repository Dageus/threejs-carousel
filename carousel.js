
import * as THREE from "three";
//'use strict';

// TODO usar ParametricGeometry porque era demasiado tarde para eu entender como isto funciona
class Seats {
    constructor(radius, height, materialManager) {
        this.seatGroup = new THREE.Group();
        this.spotlights = [];

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
            
            seat.position.set(x, y, z); 
            seat.rotation.y = angle; 
            seat.castShadow = true;
            seat.receiveShadow = true;

            materialManager.addObject(seat);
            let spotlightObject = this.createSpotlight();

            spotlightObject.spotLight.position.set(x, height - 2.5, z);
            spotlightObject.targetObject.position.set(x, height, z);
            this.spotlights.push(spotlightObject.spotLight);

            this.seatGroup.add(seat, spotlightObject.spotLight, spotlightObject.targetObject);
        }
    }

    createSpotlight() {
        const spotLight = new THREE.SpotLight(new THREE.Color('white'), 100);
        const targetObject = new THREE.Object3D();
        
        spotLight.target = targetObject;

        return { spotLight, targetObject };
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

        this.seats = new Seats(10, 30, materialManager);
        this.spotlights = this.seats.spotlights;

        this.innerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats.seatGroup);
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
        
        this.seats = new Seats(20, 20, materialManager);
        this.spotlights = this.seats.spotlights;

        this.middleRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats.seatGroup);
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
        
        this.seats = new Seats(30, 10, materialManager);
        this.spotlights = this.seats.spotlights;

        this.outerRing.add(this.upperRing, this.lowerRing, this.outerWall, this.seats.seatGroup);
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

    this.outerRing = new OuterRing(materialManager);
    this.middleRing = new MiddleRing(materialManager); 
    this.innerRing = new InnerRing(materialManager);
    this.spotlights = new THREE.Group();
    this.spotlights = [];
    this.spotlights = [...this.outerRing.spotlights, ...this.middleRing.spotlights, ...this.innerRing.spotlights];

    this.carouselGroup.add(this.pillar, this.outerRing.outerRing, this.middleRing.middleRing, this.innerRing.innerRing);
  }

}