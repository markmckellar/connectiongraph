import { Junction } from "./junction";
import { Walker } from "./walker";
import { WorldObject } from "../../world/worldobject";
import { WalkerWorld } from "./walkerworld";
import { WorldId } from "../../world/worldid";
//import { WorldObjectDisplay } from "../display/worldobjectdisplay";


export abstract class Destination extends WorldObject {
    //private _inPathList: Array<Path>;
    //private _outPathList: Array<Path>;
    //private _walkerList: Array<Walker>;

    private  _junctionWorldId:WorldId;

    public constructor(worldId:WorldId,junction:Junction)  {
        super(worldId);
        this.junctionWorldId=junction.worldId;
    }

    public abstract isDestination(walker:Walker):boolean;

    public getJunction(walkerWorld:WalkerWorld): Junction {
        //console.log("Destination.getJunction.this.junctionWorldId="+this.junctionWorldId.id);
		return walkerWorld.getJunction(this.junctionWorldId);
	}


	public get junctionWorldId(): WorldId {
		return this._junctionWorldId;
	}

	public set junctionWorldId(value: WorldId) {
		this._junctionWorldId = value;
	}
    
}
