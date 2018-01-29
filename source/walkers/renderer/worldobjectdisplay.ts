import { WorldShape } from "./shapes/worldshape";
import { World } from "../walkerworld/world";




export abstract class WorldObjectDisplay {
    private _shapes:Map<string,WorldShape>;  
    
    constructor(shapePoints:Map<string,WorldShape>) {
        this.shapes = shapePoints;
    }


	public abstract drawObject(worldObjectDisplay:WorldObjectDisplay,world:World):void;
	
	

	public get shapes(): Map<string,WorldShape> {
		return this._shapes;
	}

	public set shapes(value: Map<string,WorldShape>) {
		this._shapes = value;
	}
	
};