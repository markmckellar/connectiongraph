//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
//import { DisplayHolder } from "../display/displayholder";
import { WorldEngine } from "../engine/worldengine";
import { WorldPosition } from "./worldposition";
import { WorldObject } from "./worldobject";
import { CanvasHolder } from "../display/canvas/canvasholder";
import { WorldId } from "./worldid";


export abstract class World {

   // private _displayHolder:DisplayHolder;
	private _worldEngine:WorldEngine;

    constructor(worldEngine:WorldEngine){
		this.worldEngine = worldEngine;
	}

	public abstract addWorldObject(worldObject:WorldObject):void;

    public abstract getWorldObjectMatchingWorldId(worldId:WorldId):WorldObject;
	
	public abstract getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject;

	public abstract drawWorld(canvasHolder:CanvasHolder):void;

	public get worldEngine(): WorldEngine {
		return this._worldEngine;
	}

	public set worldEngine(value: WorldEngine) {
		this._worldEngine = value;
	}
    
}