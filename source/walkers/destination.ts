import { Junction } from "./junction";
import { Walker } from "./walker";
import { WorldObject } from "./worldobject";
import { WorldId } from "./worldid";

export abstract class Destination extends WorldObject {
    //private _inPathList: Array<Path>;
    //private _outPathList: Array<Path>;
    //private _walkerList: Array<Walker>;

    private  _junction:Junction;

    public constructor(worldId:WorldId,junction:Junction) {
        super(worldId);
        this._junction=junction;
    }

    public abstract isDestination(walker:Walker):boolean;

    public getJunction(): Junction {
		return this._junction;
	}

	public setJunction(value: Junction) {
		this._junction = value;
	}
}
