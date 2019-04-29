import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";

export abstract class BaseTest {
    worldEngine:WorldEngine;
    world:World;
    canvasHolder:CanvasHolderHTML;
    private intervalId:any;

    
    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {
        this.worldEngine = worldEngine;
        this.world = world;
        this.canvasHolder = canvasHolder;
    }

    public stopCurrent():void {
     if(this.worldEngine) this.worldEngine.stopEngine();
     console.log("BaseTest:clearing for:"+this.intervalId);
     clearInterval(this.intervalId);
    }

    public abstract buildTest():void;

    public runTests():void {
        this.stopCurrent();
        this.buildTest();

        let worldEngine = this.worldEngine;
        let world = this.world;
        let canvasHolder = this.canvasHolder;

        worldEngine.createBounds(canvasHolder.getWidth(),canvasHolder.getHeight(),{restitution:0.9});
        let interval:number = 1000/30; //one millisecond over beat per second
        console.log("drawing every : "+interval+"ms");
        this.intervalId =  setInterval(doDraw,interval);
        
        worldEngine.startEngine();
        function doDraw()
        {
            world.drawWorld(canvasHolder);	
        }
    }
}