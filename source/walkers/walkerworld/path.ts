import { Junction } from "./junction";
import { WorldObject } from "./worldobject";
import { WorldId } from "./worldid";
import { WorldObjectDisplay } from "../renderer/worldobjectdisplay";


export class Path extends WorldObject {

    private _startJunction: Junction;    
	private _endJunction: Junction;
	
	public static getPathId(startJunction:Junction,endJunction:Junction):WorldId{
		return(new WorldId(startJunction.worldId.id+":"+endJunction.worldId.id));
	}
    
    public constructor(startJunction:Junction,endJunction:Junction,worldObjectDisplay:WorldObjectDisplay)  {
         super(Path.getPathId(startJunction,endJunction),worldObjectDisplay);
         this.startJunction = startJunction;
         this.endJunction = endJunction;
	}
	
	/*
	public getPathId():WorldId{
		return(Path.getPathId(this.startJunction,this.endJunction));
	}
*/
	public get startJunction(): Junction {
		return this._startJunction;
	}

	public set startJunction(value: Junction) {
		this._startJunction = value;
	}

	public get endJunction(): Junction {
		return this._endJunction;
	}

	public set endJunction(value: Junction) {
		this._endJunction = value;
	}


}
