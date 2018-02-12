import { WorldPosition } from "../../walkerworld/worldposition";
import { World } from "../../engine/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export abstract  class EngineShape {
	private _position:WorldPosition;
	private _shapeName:string;

    constructor(shapeName:string,position:WorldPosition)
    {
		this.shapeName = shapeName;
        this.position = position;
    }

	public abstract moveShape(worldObjectDisplay:WorldObjectDisplay,world:World,):void;
    

	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}
    

    

	public get shapeName(): string {
		return this._shapeName;
	}

	public set shapeName(value: string) {
		this._shapeName = value;
	}
	
};