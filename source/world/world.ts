//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
//import { DisplayHolder } from "../display/displayholder";
import { WorldEngine } from "../engine/worldengine";
import { WorldPosition } from "./worldposition";
import { WorldObject } from "./worldobject";
import { CanvasHolder } from "../display/canvas/canvasholder";


export abstract class World {

   // private _displayHolder:DisplayHolder;
	private _worldEngine:WorldEngine;

    constructor(worldEngine:WorldEngine){
		this.worldEngine = worldEngine;
	}
	
	public getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject {
		return(null);
	}

	public abstract drawWorld(canvasHolder:CanvasHolder):void;

	public get worldEngine(): WorldEngine {
		return this._worldEngine;
	}

	public set worldEngine(value: WorldEngine) {
		this._worldEngine = value;
	}
    
}