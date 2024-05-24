export class InputManager {
    constructor() {
        this.lastMaterialEvent = MaterialEvent.Gouraud;

        this.lightMaterialToggle = true;
        this.lightMaterialKeyUp = true;

        this.directionalLightToggle = true;
        this.directionalLightKeyUp = true;

        this.pointLightsToggle = true;
        this.pointLightsKeyUp = true;

        this.spotlightsToggle = true;
        this.spotlightsKeyUp = true;
                                              
        this.moveOuterRing = false;

        this.moveMiddleRing = false;

        this.moveInnerRing = false;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        console.log(event.code);
        switch (event.code) {
            case "Digit1":
                this.dispatchMoveOuterRingEvent(true);
                break;
            case "Digit2":
                this.dispatchMoveMiddleRingEvent(true);
                break;
            case "Digit3":
                this.dispatchMoveInnerRingEvent(true);
                break;
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
                this.dispatchSpotilghtsEvent();
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
            case "Digit1":
                this.dispatchMoveOuterRingEvent(false);
                break;
            case "Digit2":
                this.dispatchMoveMiddleRingEvent(false);
                break;
            case "Digit3":
                this.dispatchMoveInnerRingEvent(false);
                break;
            case "KeyT":
                this.lightMaterialKeyUp = true;
                break;
            case "KeyD":
                this.directionalLightKeyUp = true;
                break;
            case "KeyP":
                this.pointLightsKeyUp = true;
                break;
            case "KeyS":
                this.spotlightsKeyUp = true;
                break;
            default:
                break;
        }

        const imgElement = document.getElementById(event.code);
        if (imgElement) {
            imgElement.src = `./${event.code}-KeyNotPressed.png`;
        }
    }

    dispatchMoveOuterRingEvent(move) {
        if (move === this.moveOuterRing) {
            return;
        }

        this.moveOuterRing = move;
        const moveOuterRing = new CustomEvent("moveOuterRing", { detail: { move: move } });
        document.dispatchEvent(moveOuterRing);
    }

    dispatchMoveMiddleRingEvent(move) {
        if (move === this.moveMiddleRing) {
            return;
        }

        this.moveMiddleRing = move;
        const moveMiddleRing = new CustomEvent("moveMiddleRing", { detail: { move: move } });
        document.dispatchEvent(moveMiddleRing);
    }

    dispatchMoveInnerRingEvent(move) {
        if (move === this.moveInnerRing) {
            return;
        }

        this.moveInnerRing = move;
        const moveInnerRing = new CustomEvent("moveInnerRing", { detail: { move: move } });
        document.dispatchEvent(moveInnerRing);
    }

    dispatchMaterialEvent(materialEvent) {
        if (materialEvent === this.lastMaterialEvent && this.lightMaterialToggle) {
            return;
        }
        this.lightMaterialToggle = true;
        const costumEvent = new CustomEvent(materialEvent);
        document.dispatchEvent(costumEvent);
        this.lastMaterialEvent = materialEvent;
    }

    dispatchMaterialLightEvent() {
        if (!this.lightMaterialKeyUp) {
            return;
        }

        this.lightMaterialToggle = !this.lightMaterialToggle;
        if (this.lightMaterialToggle) {
            const costumEvent = new CustomEvent(this.lastMaterialEvent);
            document.dispatchEvent(costumEvent);
        } else {
            const costumEvent = new CustomEvent(MaterialEvent.Light);
            document.dispatchEvent(costumEvent);
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
        this.directionalLightKeyUp = false;
    }

    dispatchPonctualLightsEvent() {
        if (!this.pointLightsKeyUp) {
            return;
        }

        this.pointLightsToggle = !this.pointLightsToggle;
        const costumEvent = new CustomEvent("togglePointLights", {detail: {toggle: this.pointLightsToggle }});
        document.dispatchEvent(costumEvent);
        this.pointLightsKeyUp = false;
    }

    dispatchSpotilghtsEvent() {
        if (!this.spotlightsKeyUp) {
            return;
        }

        this.spotlightsToggle = !this.spotlightsToggle;
        const costumEvent = new CustomEvent("toggleSpotlights", { detail: {toggle: this.spotlightsToggle }});
        document.dispatchEvent(costumEvent);
        this.spotlightsKeyUp = false;
    }
}

const MaterialEvent = {
    Gouraud: "changeToGouraudEvent",
    Phong: "changeToPhongEvent",
    Cartoon: "changeToCartoonEvent",
    NormalMap: "changeToNormalMapEvent",
    Light: "toggleLightMaterialEvent"
}