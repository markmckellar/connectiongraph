import { Junction } from "./junction";
import { WorldObject } from "./worldobject";


export class Path extends WorldObject {

    private _startJunction: Junction;    
	private _endJunction: Junction;
	
	public static getPathId(startJunction:Junction,endJunction:Junction):string{
		return(startJunction.woldObjectId+":"+endJunction.woldObjectId);
	}
    
    public constructor(startJunction:Junction,endJunction:Junction) {
         super(Path.getPathId(startJunction,endJunction));
         this.startJunction = startJunction;
         this.endJunction = endJunction;
	}
	
	public getPathId():string{
		return(Path.getPathId(this.startJunction,this.endJunction));
	}

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
