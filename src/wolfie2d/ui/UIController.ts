/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { GradientCircle } from "../scene/sprite/GradientCircle";

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;

    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph) : void {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("mouseover", this.mouseOverHandler);
        canvas.addEventListener("dblclick", this.mouseDoubleClickHandler);
        canvas.addEventListener("click", this.mouseSingleClickHandler);
    }

    public mouseOverHandler = (event : MouseEvent) : void => {
        return;
    }

    public mouseDoubleClickHandler = (event : MouseEvent) : void => {
        let mousex : number = event.clientX;
        let mousey : number = event.clientY;
        let animatedSprites = this.scene.getSprites();
        let gradientCirlces = this.scene.getCircles();

        for (let i = 0; i <animatedSprites.length; i++) {
            if (animatedSprites[i].contains(mousex, mousey)){
                animatedSprites.splice(i, 1);
                return;
            }
        }
        for (let i = 0; i <gradientCirlces.length; i++) {
            if (gradientCirlces[i].contains(mousex, mousey)){
                gradientCirlces.splice(i, 1);
                return;
            }
        }
    }

    public mouseSingleClickHandler = (event : MouseEvent) : void => {
        let mousex : number = event.clientX;
        let mousey : number = event.clientY;

        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousex, mousey);
        let circle : GradientCircle = this.scene.getCircleAt(mousex, mousey);

        if (sprite == null && circle == null){
            let op = Math.floor(Math.random() * 3);
            console.log(Math.floor(Math.random() * 3));
        }
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
    }
}