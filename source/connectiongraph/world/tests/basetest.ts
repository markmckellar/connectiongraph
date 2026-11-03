import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";

export abstract class BaseTest {
    worldEngine:WorldEngine;
    world:World;
    canvasHolder:CanvasHolderHTML;
    private animationFrameId:number|null = null;

    
    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
        this.worldEngine = worldEngine;
        this.world = world;
        this.canvasHolder = canvasHolder;
    }

    public stopCurrent():void {
     if(this.worldEngine) this.worldEngine.stopEngine();
     if(this.animationFrameId!==null) cancelAnimationFrame(this.animationFrameId);
     this.animationFrameId = null;
    }

    public abstract buildTest():void;

    public runTests():void {
        this.stopCurrent();
        this.buildTest();

        let worldEngine = this.worldEngine;
        let world = this.world;
        let canvasHolder = this.canvasHolder;

        worldEngine.createBounds(canvasHolder.getWidth(),canvasHolder.getHeight(),{restitution:0.9});
        worldEngine.startEngine();

        // Draw in step with the display's refresh rate; the engine's own
        // updateInterval still governs simulation ticks.
        const doDraw = () => {
            world.drawWorld(canvasHolder);
            this.animationFrameId = requestAnimationFrame(doDraw);
        };
        this.animationFrameId = requestAnimationFrame(doDraw);
    }
}