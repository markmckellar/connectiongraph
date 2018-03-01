//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
//import { DisplayHolder } from "../display/displayholder";
import { WorldEngine } from "../engine/worldengine";
import { WorldObject } from "./worldobject";
import { World } from "./world";
import { CanvasHolder } from "../display/canvas/canvasholder";
import { WorldPosition } from "./worldposition";


export class WorldOfWorldObjects extends World{

    private _worldObjectArray:Array<WorldObject>;

    constructor(worldEngine:WorldEngine){
        super(worldEngine);
        this.worldObjectArray = new Array<WorldObject>();
	}
	
	
	public drawWorld(canvasHolder:CanvasHolder):void {
        let context = canvasHolder.getContext();
        canvasHolder.clearCanvas();
        for(let i=0;i<this.worldObjectArray.length;i++) {
            let worldObject:WorldObject = this.worldObjectArray[i];
            worldObject.getDrawable().draw(context);
        }
    }

    public getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject {
        let foundObject:WorldObject = null;
        for(let i=0;i<this.worldObjectArray.length;i++) {
            ////console.log("this.worldObjectArray.length="+this.worldObjectArray.length+":i="+i);
            let worldObject:WorldObject = this.worldObjectArray[i];
            ////console.log("    worldObject.position="+worldObject.getWorldPosition());
            if(worldObject.containsWorldPosition(worldPosition)) foundObject = worldObject;
        }
        return(foundObject);
    }


	public get worldObjectArray(): Array<WorldObject> {
		return this._worldObjectArray;
	}

	public set worldObjectArray(value: Array<WorldObject>) {
		this._worldObjectArray = value;
	}

    
}