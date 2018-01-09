import { Junction } from "./junction";
import { WorldObject } from "./worldobject";


export class Path extends WorldObject {

    private _startJunction: Junction;    
    private _endJunctin: Junction;
    
    public constructor(woldObjectId:string,startJunction:Junction,endJunction:Junction) {
         super(woldObjectId);
         this.startJunction = startJunction;
         this.endJunctin = endJunction;
    }

	public get startJunction(): Junction {
		return this._startJunction;
	}

	public set startJunction(value: Junction) {
		this._startJunction = value;
	}

	public get endJunctin(): Junction {
		return this._endJunctin;
	}

	public set endJunctin(value: Junction) {
		this._endJunctin = value;
	}

}
