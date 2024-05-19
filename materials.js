import * as THREE from 'three';

class Materials {
    constructor() {
        this.objectsDict = [];

        this.meshLambertMaterial = new THREE.MeshLambertMaterial({color: THREE.Color.NAMES.blue});
        this.meshPhongMaterial = new THREE.MeshPhongMaterial({color: THREE.Color.NAMES.green});
        this.meshToonMaterial = new THREE.MeshToonMaterial({color: THREE.Color.NAMES.yellow});
        this.meshNormalMaterial = new THREE.MeshNormalMaterial();
        this.meshBasicMaterial = new THREE.MeshBasicMaterial({color: THREE.Color.NAMES.pink});

        addEventListener("changeToGouraudEvent", this.handleChangeToGouraud.bind(this));
        addEventListener("changeToPhongEvent", this.handleChangeToGouraud.bind(this));
        addEventListener("changeToCartoonEvent", this.handleChangeToCartoon.bind(this));
        addEventListener("changeToNormalMapEvent", this.handleChangeToNormalMap.bind(this));
        addEventListener("changeLightEvent", this.handleChangeLight.bind(this));
    }

    addObject(object) {
        this.objectsDict.push({object: object, color: object.material.color})
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
            item.object.material = material;
            item.object.material.color = item.color;
        });
    }
}