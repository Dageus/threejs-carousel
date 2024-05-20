export class InputManager {
    constructor() {
        this.lastMaterialEvent = MaterialEvent.Gouraud;

        this.lightMaterialToggle = true;
        this.lightMaterialKeyUp = true;

        this.directionalLightToggle = true;
        this.directionalLightKeyUp = true;

        this.ponctualLightsToggle = true;
        this.ponctualLightsKeyUp = true;

        this.spotlightToggle = true;
        this.spotlightKeyUp = true;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        switch (event.code) {
            case "KeyQ":
                this.dispatchMaterialEvent(MaterialEvent.Gouraud);
                break;
            case "KeyW":
                this.dispatchMaterialEvent(MaterialEvent.Phong);
                break;
            case "KeyE":
                this.dispatchMaterialEvent(MaterialEvent.Cartoon);
                break;
            case "KeyR":
                this.dispatchMaterialEvent(MaterialEvent.NormalMap);
                break;
            case "KeyT":
                this.dispatchMaterialLightEvent();
                break;
            case "KeyD":
                this.dispatchDirectionalLightEvent();
                break;
            case "KeyP":
                this.dispatchPonctualLightsEvent();
                break;
            case "KeyS":
                this.dispatchSpotilghtEvent();
                break;
            default:
                break;
        }

        const imgElement = document.getElementById(event.code);
        if (imgElement) {
            imgElement.src = `./${event.code}-KeyPressed.png`;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case "KeyT":
                this.lightMaterialKeyUp = true;
                break;
            case "KeyD":
                this.directionalLightKeyUp = true;
                break;
            case "KeyP":
                this.ponctualLightsKeyUp = true;
                break;
            case "KeyS":
                this.spotlightKeyUp = true;
                break;
            default:
                break;
        }

        const imgElement = document.getElementById(event.code);
        if (imgElement) {
            imgElement.src = `./${event.code}-KeyNotPressed.png`;
        }
    }

    dispatchMaterialEvent(materialEvent) {
        if (materialEvent === this.lastMaterialEvent && this.lightMaterialToggle) {
            return;
        }
        this.lightMaterialToggle = true;
        const costumEvent = new CustomEvent(materialEvent);
        document.dispatchEvent(costumEvent);
        this.lastMaterialEvent = materialEvent;
        console.log("dispatch " + materialEvent);
        console.log("Lights: " + this.lightMaterialToggle);
    }

    dispatchMaterialLightEvent() {
        if (!this.lightMaterialKeyUp) {
            return;
        }

        this.lightMaterialToggle = !this.lightMaterialToggle;
        if (this.lightMaterialToggle) {
            const costumEvent = new CustomEvent(this.lastMaterialEvent);
            document.dispatchEvent(costumEvent);
            console.log("dispatch " + this.lastMaterialEvent);
            console.log("Lights: " + this.lightMaterialToggle);
        } else {
            const costumEvent = new CustomEvent(MaterialEvent.Light);
            document.dispatchEvent(costumEvent);
            console.log("dispatch " + MaterialEvent.Light);
            console.log("Lights: " + this.lightMaterialToggle);
        }
        this.lightMaterialKeyUp = false;
    }

    dispatchDirectionalLightEvent() {
        if (!this.directionalLightKeyUp) {
            return;
        }

        this.directionalLightToggle = !this.directionalLightToggle;
        const costumEvent = new CustomEvent("toggleDirectionalLight", { detail: {toggle: this.directionalLightToggle } });
        document.dispatchEvent(costumEvent);
        console.log("dispatch toggleDirectionalLight + ", this.directionalLightToggle);
        this.directionalLightKeyUp = false;
    }

    dispatchPonctualLightsEvent() {
        if (!this.ponctualLightsKeyUp) {
            return;
        }

        this.ponctualLightsToggle = !this.ponctualLightsToggle;
        const costumEvent = new CustomEvent("togglePonctualLights", {detail: {toggle: this.ponctualLightsToggle }});
        document.dispatchEvent(costumEvent);
        console.log("dispatch togglePonctualLights + ", this.ponctualLightsToggle);
        this.ponctualLightsKeyUp = false;
    }

    dispatchSpotilghtEvent() {
        if (!this.spotlightKeyUp) {
            return;
        }

        this.spotlightToggle = !this.spotlightToggle;
        const costumEvent = new CustomEvent("toggleSpotlight", { detail: {toggle: this.spotlightToggle }});
        document.dispatchEvent(costumEvent);
        console.log("dispatch toggleSpotlight + ", this.spotlightToggle);
        this.spotlightKeyUp = false;
    }
}

const MaterialEvent = {
    Gouraud: "changeToGouraudEvent",
    Phong: "changeToPhongEvent",
    Cartoon: "changeToCartoonEvent",
    NormalMap: "changeToNormalMapEvent",
    Light: "toggleLightMaterialEvent"
}