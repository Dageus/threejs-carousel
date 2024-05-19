export class InputManager {
    constructor() {
        this.lastMaterialEvent = MaterialEvent.Gouraud;
        this.lightToggle = true;

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
                this.dispatchLightEvent();
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
            default:
                break;
        }

        const imgElement = document.getElementById(event.code);
        if (imgElement) {
            imgElement.src = `./${event.code}-KeyNotPressed.png`;
        }
    }

    dispatchMaterialEvent(materialEvent) {
        if (materialEvent === this.lastMaterialEvent) {
            return;
        }
        this.lightToggle = true;
        const costumEvent = new CustomEvent(materialEvent);
        document.dispatchEvent(costumEvent);
        this.lastMaterialEvent = materialEvent;
        console.log("dispatch " + materialEvent);
        console.log("Lights: " + this.lightToggle);
    }

    dispatchLightEvent() {
        this.lightToggle = !this.lightToggle;
        if (this.lightToggle) {
            const costumEvent = new CustomEvent(this.lastMaterialEvent);
            document.dispatchEvent(costumEvent);
            console.log("dispatch " + this.lastMaterialEvent);
            console.log("Lights: " + this.lightToggle);
        } else {
            const costumEvent = new CustomEvent(MaterialEvent.Light);
            document.dispatchEvent(costumEvent);
            console.log("dispatch " + MaterialEvent.Light);
            console.log("Lights: " + this.lightToggle);
        }
    }
}

const MaterialEvent = {
    Gouraud: "changeToGouraudEvent",
    Phong: "changeToPhongEvent",
    Cartoon: "changeToCartoonEvent",
    NormalMap: "changeToNormalMapEvent",
    Light: "changeLightEvent"
}