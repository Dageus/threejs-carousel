import * as THREE from 'three';

export class Materials {
    constructor() {
        this.objectsDict = [];

        this.meshLambertMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
        this.meshPhongMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
        this.meshToonMaterial = new THREE.MeshToonMaterial({ side: THREE.DoubleSide });
        this.meshNormalMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        this.meshBasicMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });

        document.addEventListener("changeToGouraudEvent", this.handleChangeToGouraud.bind(this));
        document.addEventListener("changeToPhongEvent", this.handleChangeToPhong.bind(this));
        document.addEventListener("changeToCartoonEvent", this.handleChangeToCartoon.bind(this));
        document.addEventListener("changeToNormalMapEvent", this.handleChangeToNormalMap.bind(this));
        document.addEventListener("toggleLightMaterialEvent", this.handleChangeLight.bind(this));
        document.getElementById('materialID').innerText = 'Current Shading: Gouraud'
        document.getElementById('lightMaterial').innerText = 'Light Calculation: On'
    }

    addObject(object) {
        this.objectsDict.push({ object: object, color: object.material.color })
    }

    handleChangeToGouraud() {
        this.changeAllObjects(this.meshLambertMaterial);
        document.getElementById('materialID').innerText = 'Current Shading: Gouraud'
        document.getElementById('lightMaterial').innerText = 'Light Calculation: On'
    }

    handleChangeToPhong() {
        this.changeAllObjects(this.meshPhongMaterial);
        document.getElementById('materialID').innerText = 'Current Shading: Phong'
        document.getElementById('lightMaterial').innerText = 'Light Calculation: On'
    }

    handleChangeToCartoon() {
        this.changeAllObjects(this.meshToonMaterial);
        document.getElementById('materialID').innerText = 'Current Shading: Cartoon'
        document.getElementById('lightMaterial').innerText = 'Light Calculation: On'
    }

    handleChangeToNormalMap() {
        this.objectsDict.forEach(item => {
            item.object.material = this.meshNormalMaterial;
        });
        document.getElementById('materialID').innerText = 'Current Shading: NormalMap'
        document.getElementById('lightMaterial').innerText = 'Light Calculation: On'
    }

    handleChangeLight() {
        this.changeAllObjects(this.meshBasicMaterial);
        document.getElementById('lightMaterial').innerText = 'Light Calculation: Off'
    }

    changeAllObjects(material) {
        this.objectsDict.forEach(item => {
            item.object.material = material.clone();
            item.object.material.color.set(item.color);
        });
    }
}

export class Lights {
    constructor(pointLights, spotlights) {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(80, 80, 0);
        this.directionalLight.lookAt(0, 0, 0);
        this.directionalLight.near
        this.directionalLight.castShadow = true;

        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024; 
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500; 
        this.directionalLight.shadow.camera.left = -50;
        this.directionalLight.shadow.camera.right = 50;
        this.directionalLight.shadow.camera.top = 50;
        this.directionalLight.shadow.camera.bottom = -50;

        this.pointLights = pointLights;
        this.spotlights = spotlights;

        this.lightsGroup = new THREE.Group();

        const ambientLight = new THREE.AmbientLight(new THREE.Color('orangered'), 0.1); 

        this.lightsGroup.add(ambientLight, this.directionalLight);

        document.addEventListener("toggleDirectionalLight", this.handleDirectionalLight.bind(this));
        document.addEventListener("togglePointLights", this.handlePointLights.bind(this));
        document.addEventListener("toggleSpotlights", this.handleSpotlights.bind(this));
        document.getElementById('directionalLight').innerText = 'Directional Light: On';
        document.getElementById('spotlights').innerText = 'Spotlights: On';
        document.getElementById('pointLights').innerText = 'Point Lights: On';
    }

    handleDirectionalLight(event) {
        if (event.detail.toggle) {
            this.directionalLight.intensity = 1;
            document.getElementById('directionalLight').innerText = 'Directional Light: On';
        } else {
            this.directionalLight.intensity = 0;
            document.getElementById('directionalLight').innerText = 'Directional Light: Off';
        }
    }

    handlePointLights(event) {
        if (event.detail.toggle) {
            this.pointLights.forEach(pointLight => {
                pointLight.intensity = 50;
            })
            document.getElementById('pointLights').innerText = 'Point Lights: On';
        } else {
            this.pointLights.forEach(pointLight => {
                pointLight.intensity = 0;
            })
            document.getElementById('pointLights').innerText = 'Point Lights: Off';
        }
    }

    handleSpotlights(event) {
        if (event.detail.toggle) {
            this.spotlights.forEach(spotlight =>{
                spotlight.intensity = 50;
            });
            document.getElementById('spotlights').innerText = 'Spotlights: On';
        } else {
            this.spotlights.forEach(spotlight =>{
                spotlight.intensity = 0;
        });
            document.getElementById('spotlights').innerText = 'Spotlights: Off';
        }
    }
}