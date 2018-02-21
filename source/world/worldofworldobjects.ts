//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
//import { DisplayHolder } from "../display/displayholder";
import { WorldEngine } from "../engine/worldengine";
import { WorldObject } from "./worldobject";
import { World } from "./world";
import { CanvasHolder } from "../display/canvas/canvasholder";


export class WorldOfWorldObjects extends World{

    private _worldObjectArray:Array<WorldObject>;

    constructor(worldEngine:WorldEngine){
        super(worldEngine);
        this.worldObjectArray = new Array<WorldObject>();
	}
	
	
	public drawWorld(canvasHolder:CanvasHolder):void {
        let context = canvasHolder.getContext();

        for(let i=0;i<this.worldObjectArray.length;i++) {
            let worldObject:WorldObject = this.worldObjectArray[i];
            worldObject.drawable.draw(context);
        }
    }

	public get worldObjectArray(): Array<WorldObject> {
		return this._worldObjectArray;
	}

	public set worldObjectArray(value: Array<WorldObject>) {
		this._worldObjectArray = value;
	}

    
}