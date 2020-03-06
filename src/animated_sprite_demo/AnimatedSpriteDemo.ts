/*
 * AnimatedSpriteDemo.ts - demonstrates some simple sprite rendering and 
 * animation as well as some basic mouse interactions. Note that the
 * AnimationSpriteDemo class loads and creates custom content for the
 * purpose of demonstrating basic functionality.
 */
import {Game} from '../wolfie2d/Game'
import {ResourceManager} from '../wolfie2d/files/ResourceManager'
import {TextToRender} from '../wolfie2d/rendering/TextRenderer'
import {WebGLGameRenderingSystem} from '../wolfie2d/rendering/WebGLGameRenderingSystem'
import {SceneGraph} from '../wolfie2d/scene/SceneGraph'
import {AnimatedSprite} from '../wolfie2d/scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../wolfie2d/scene/sprite/AnimatedSpriteType'
import { GradientCircle } from '../wolfie2d/scene/sprite/GradientCircle'

// IN THIS EXAMPLE WE'LL HAVE 2 SPRITE TYPES THAT EACH HAVE THE SAME 2 STATES
// AND WHERE EACH SPRITE TYPE HAS ITS OWN SPRITE SHEET
const DEMO_SPRITE_TYPES : string[] = [
    'resources/animated_sprites/RedCircleMan.json',
    'resources/animated_sprites/MultiColorBlock.json'
];
const DEMO_SPRITE_STATES = {
    FORWARD_STATE: 'FORWARD',
    REVERSE_STATE: 'REVERSE'
};
const DEMO_TEXTURES : string[] = [
    'resources/images/EightBlocks.png', 
    'resources/images/RedCircleMan.png'
];

class AnimatedSpriteDemo {
    constructor() {}
    /**
     * This method initializes the application, building all the needed
     * game objects and setting them up for use.
     */
    public buildTestScene(game : Game, callback : Function) {
        let renderingSystem : WebGLGameRenderingSystem = game.getRenderingSystem();
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let resourceManager : ResourceManager = game.getResourceManager();
        let builder = this;
        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_canvas");

        // EMPLOY THE RESOURCE MANAGER TO BUILD ALL THE WORLD CONTENT
        resourceManager.loadTextures(DEMO_TEXTURES, renderingSystem, function() {
            // ONLY AFTER ALL THE TEXTURES HAVE LOADED LOAD THE SPRITE TYPES
            resourceManager.loadSpriteTypes(DEMO_SPRITE_TYPES, function() {
                // ONLY AFTER ALL THE SPRITE TYPES HAVE LOADED LOAD THE SPRITES
                builder.buildAnimatedSprites(resourceManager, sceneGraph);
                
                builder.buildGradientCircles(sceneGraph);

                // AND BUILD ALL THE TEXT OUR APP WILL USE
                builder.buildText(game);

                builder.setUpMouseEvent(canvas, builder, game);

                // EVERYTHING HAS BEEN BUILT, CALL THE CALLBACK
                callback();
            });
        });
    }
    public setUpMouseEvent(canvas : HTMLCanvasElement, builder : AnimatedSpriteDemo, game : Game){
        canvas.addEventListener("mousemove", function(event) {
            builder.mouseMoveHandler(event, game.getSceneGraph());
        });

        canvas.addEventListener("dblclick", function(event) {
            builder.mouseDoubleClickHandler(event, game.getSceneGraph());
        });

        canvas.addEventListener("click", function(event) {
            builder.mouseSingleClickHandler(event, game.getResourceManager(), game.getSceneGraph());
        });
    }

    public mouseMoveHandler(event : MouseEvent, scene : SceneGraph){
        let textRenderer = game.getRenderingSystem().getTextRenderer();
        let detailT = new TextToRender("detailT", "", 40, 70, function() {
            let mousex : number = event.clientX;
            let mousey : number = event.clientY;

            let sprite : AnimatedSprite = scene.getSpriteAt(mousex, mousey);
            let circle : GradientCircle = scene.getCircleAt(mousex, mousey);

            if (sprite != null || circle != null){
                if (circle != null){
                    detailT.text = circle.toString(); 
                }else {
                    detailT.text = sprite.toString();
                }
            }else {
                textRenderer.remove("detailT");
            }
        });
        if (textRenderer.contains("detailT") == true){
            textRenderer.remove("detailT");
        }
        textRenderer.addTextToRender(detailT);
    }

    public mouseDoubleClickHandler(event : MouseEvent, scene : SceneGraph) {
        let mousex : number = event.clientX;
        let mousey : number = event.clientY;
        let animatedSprites : Array<AnimatedSprite> = scene.getSprites();
        let gradientCirlces : Array<GradientCircle> = scene.getCircles();

        for (let i = gradientCirlces.length-1; i >= 0; i--) {
            if (gradientCirlces[i].contains(mousex, mousey)){
                gradientCirlces.splice(i, 1);
                return;
            }
        }
        for (let i = animatedSprites.length-1; i >= 0; i--) {
            if (animatedSprites[i].contains(mousex, mousey)){
                animatedSprites.splice(i, 1);
                return;
            }
        }
    }

    public mouseSingleClickHandler(event : MouseEvent, resourceManager : ResourceManager, scene : SceneGraph) {
        let mousex : number = event.clientX;
        let mousey : number = event.clientY;

        let sprite : AnimatedSprite = scene.getSpriteAt(mousex, mousey);
        let circle : GradientCircle = scene.getCircleAt(mousex, mousey);

        if (sprite == null && circle == null){
            let op = Math.floor(Math.random() * 3);
            
            let spriteTypeToUse : string;
            let animatedSpriteType : AnimatedSpriteType;
            let spriteToAdd : AnimatedSprite;
            let gCircleToAdd : GradientCircle;
            switch(op){
                case 0:
                    spriteTypeToUse = DEMO_SPRITE_TYPES[0];
                    animatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                    spriteToAdd = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
                    spriteToAdd.getPosition().set(mousex-(animatedSpriteType.getSpriteWidth()/2), mousey-(animatedSpriteType.getSpriteHeight()/2), 0.0, 1.0);
                    scene.addAnimatedSprite(spriteToAdd);
                    break;
                case 1:
                    spriteTypeToUse = DEMO_SPRITE_TYPES[1];
                    animatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                    spriteToAdd = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
                    spriteToAdd.getPosition().set(mousex-(animatedSpriteType.getSpriteWidth()/2), mousey-(animatedSpriteType.getSpriteHeight()/2), 0.0, 1.0);
                    scene.addAnimatedSprite(spriteToAdd);
                    break;
                case 2:
                    let randomC : number = Math.floor(Math.random() * 6);
                    gCircleToAdd = new GradientCircle(256, 256, randomC);
                    gCircleToAdd.getPosition().set(mousex-(gCircleToAdd.getWidth()/2), mousey-(gCircleToAdd.getHeight()/2), 0.0, 1.0);
                    scene.addGCircle(gCircleToAdd);
                    break;
                default:
                    break;
            }
        }
    }

    private buildGradientCircles(scene : SceneGraph){
        let canvasWidth : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).width;
        let canvasHeight : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).height;

        for (let i = 0; i < 5; i++){
            let randomC : number = Math.floor(Math.random() * 6);
            let gCircleToAdd : GradientCircle = new GradientCircle(256, 256, randomC);
            let randomX : number = Math.floor(Math.random() * canvasWidth) - (gCircleToAdd.getWidth()/2);
            let randomY : number = Math.floor(Math.random() * canvasHeight) - (gCircleToAdd.getHeight()/2);
            gCircleToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGCircle(gCircleToAdd);
        }
    }

    /*
     * Builds all the animated sprites to be used by the application and
     * adds them to the scene.
     */
    private buildAnimatedSprites(resourceManager : ResourceManager, scene : SceneGraph) {
        let canvasWidth : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).width;
        let canvasHeight : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).height;

        // BUILD A BUNCH OF CIRCLE SPRITES
        for (let i = 0; i < DEMO_SPRITE_TYPES.length; i++) {
            for (let j = 0; j < 5; j++) {
                let spriteTypeToUse : string = DEMO_SPRITE_TYPES[i];
                let animatedSpriteType : AnimatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE);
                let randomX : number = Math.floor(Math.random() * canvasWidth) - (animatedSpriteType.getSpriteWidth()/2);
                let randomY : number = Math.floor(Math.random() * canvasHeight) - (animatedSpriteType.getSpriteHeight()/2);
                spriteToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
                scene.addAnimatedSprite(spriteToAdd);
            }
        }
    }

    /*
     * Builds all the text to be displayed in the application.
     */
    private buildText(game : Game) {
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let numSpritesText = new TextToRender("Num Sprites", "", 20, 50, function() {
            let numSprites = sceneGraph.getNumSprites();
            let numCircles = sceneGraph.getNumCircles();
            let total = numSprites+numCircles;
            numSpritesText.text = "Number of Scene Objects: " + total;
        });
        let textRenderer = game.getRenderingSystem().getTextRenderer();
        textRenderer.addTextToRender(numSpritesText);
    }
}

// THIS IS THE ENTRY POINT INTO OUR APPLICATION, WE MAKE
// THE Game OBJECT AND INITIALIZE IT WITH THE CANVASES
let game = new Game();
game.init("game_canvas", "text_canvas");

// BUILD THE GAME SCENE
let demo = new AnimatedSpriteDemo();
demo.buildTestScene(game, function() {
    // AND START THE GAME LOOP
    game.start();
});