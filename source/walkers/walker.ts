import { Junction } from "./junction";
import { WorldObject } from "./worldobject";

export class Walker extends WorldObject {
    private _currentJunction: Junction;

    public constructor(woldObjectId:string,junction:Junction) {
        super(woldObjectId);
		this.currentJunction =junction;
    }

    public get currentJunction(): Junction {
		return this._currentJunction;
	}

	public set currentJunction(value: Junction) {
		this._currentJunction = value;
	}
}
