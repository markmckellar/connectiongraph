import { WorldShape } from "./shapes/worldshape";
import { WorldObject } from "../walkerworld/worldobject";
import { World } from "../walkerworld/world";

import { WorldPosition } from "../walkerworld/worldposition";




export abstract class WorldObjectDisplay {
	private _shapes:Map<string,WorldShape>;
	private _position:WorldPosition;
	
    
    constructor(position:WorldPosition,shapes:Map<string,WorldShape>) {
		this.shapes = shapes;
		this.position = position;
    }


	public abstract drawObject(worldObjectDisplay:WorldObjectDisplay,world:World):void;
	
	public getShape(worldObject:WorldObject,shapeName:string):WorldShape {

		if(!this.shapes.has(shapeName)) { throw new Error(
			worldObject.worldId.id+" is missing shape:"+shapeName);
		}
		
		return(this.shapes.get(shapeName));
		
	}

	public get shapes(): Map<string,WorldShape> {
		return this._shapes;
	}

	public set shapes(value: Map<string,WorldShape>) {
		this._shapes = value;
	}


	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}
	
	
};