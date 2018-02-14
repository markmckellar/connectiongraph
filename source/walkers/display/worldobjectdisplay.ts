//import { WorldShape } from "./shapes/worldshape";
import { WorldObject } from "../world/worldobject";
import { WalkerWorld } from "../walkerworld/walkerworld";
import { WorldPosition } from "../world/worldposition";


export abstract class WorldObjectDisplay {
	//private _shapes:Map<string,WorldShape>;
	private _position:WorldPosition;
	
    
    constructor(position:WorldPosition) {
		//this.shapes = shapes;
		this.position = position;
    }


	public abstract drawObject(walkerWorld:WalkerWorld,worldObject:WorldObject,context:CanvasRenderingContext2D):void;

	public static getColorFromString(colorString:string):string
    {
      if(colorString.length==6)
      {
        colorString += "ff";
      }
      
      let color = "rgba("+
          parseInt(colorString.substring(0,2), 16)+","+
          parseInt(colorString.substring(2,4), 16)+","+
          parseInt(colorString.substring(4,6), 16)+","+
          parseInt(colorString.substring(6,8), 16)/255.0+")";
      
      return(color);
    }
	
	/*
	public getShape(worldObject:WorldObject,shapeName:string):WorldShape {

		if(!this.shapes.has(shapeName)) { throw new Error(
			worldObject.worldId.id+" is missing shape:"+shapeName);
		}
		
		return(this.shapes.get(shapeName));
		
	}
	*/

	/*
	public get shapes(): Map<string,WorldShape> {
		return this._shapes;
	}
	
	public set shapes(value: Map<string,WorldShape>) {
		this._shapes = value;
	}
*/

	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}
	
	
};