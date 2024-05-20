import * as THREE from 'three';

export class Materials {
    constructor() {
        this.objectsDict = [];

        this.meshLambertMaterial = new THREE.MeshLambertMaterial();
        this.meshPhongMaterial = new THREE.MeshPhongMaterial();
        this.meshToonMaterial = new THREE.MeshToonMaterial();
        this.meshNormalMaterial = new THREE.MeshNormalMaterial();
        this.meshBasicMaterial = new THREE.MeshBasicMaterial();

        document.addEventListener("changeToGouraudEvent", this.handleChangeToGouraud.bind(this));
        document.addEventListener("changeToPhongEvent", this.handleChangeToGouraud.bind(this));
        document.addEventListener("changeToCartoonEvent", this.handleChangeToCartoon.bind(this));
        document.addEventListener("changeToNormalMapEvent", this.handleChangeToNormalMap.bind(this));
        document.addEventListener("toggleLightMaterialEvent", this.handleChangeLight.bind(this));
    }

    addObject(object) {
        this.objectsDict.push({ object: object, color: object.material.color })
    }

    handleChangeToGouraud() {
        this.changeAllObjects(this.meshLambertMaterial);
    }

    handleChangeToPhong() {
        this.changeAllObjects(this.meshPhongMaterial);
    }

    handleChangeToCartoon() {
        this.changeAllObjects(this.meshToonMaterial);
    }

    handleChangeToNormalMap() {
        this.objectsDict.forEach(item => {
            item.object.material = this.meshNormalMaterial;
        });
    }

    handleChangeLight() {
        this.changeAllObjects(this.meshBasicMaterial);
    }

    changeAllObjects(material) {
        this.objectsDict.forEach(item => {
            item.object.material = material.clone();
            item.object.material.color.set(item.color);
        });
    }
}

export class Lights {
    constructor() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(10, 10, -5);
        this.directionalLight.lookAt(0, 0, 0);
        this.directionalLight.castShadow = true;
        this.lightsGroup = new THREE.Group();

        const ambientLight = new THREE.AmbientLight(new THREE.Color('orangered'), 0.1); 

        this.lightsGroup.add(ambientLight, this.directionalLight);

        document.addEventListener("toggleDirectionalLight", this.handleDirectionalLight.bind(this));
        document.addEventListener("togglePonctualLights", this.handlePonctualLights.bind(this));
        document.addEventListener("toggleSpotlight", this.handleSpotlight.bind(this));
    }

    handleDirectionalLight(event) {
        if (event.detail.toggle) {
            this.directionalLight.intensity = 1;
        } else {
            this.directionalLight.intensity = 0;
        }
    }

    handlePonctualLights(toggle) {

    }

    handleSpotlight(toggle) {

    }
}