import { Destination } from "./destination";
import { WorldObject } from "./worldobject";
import { Junction } from "./junction";
import { WorldId } from "./worldid";


export class Walker extends WorldObject {
    private _currentDestination: Destination;

    public constructor(worldId:WorldId,junction:Junction) {
        super(worldId);
		this.currentDestination = junction.getWalkerDestination(this);
	}

	public isCurrentJunction(junction:Junction):boolean {
		return(this.currentDestination.getJunction().worldId.id!==junction.worldId.id)	
	}

	public getCurrentJunction(): Junction {
		return this._currentDestination.getJunction();
	}

    public get currentDestination(): Destination {
		return this._currentDestination;
	}

	public set currentDestination(value: Destination) {
		this._currentDestination = value;
	}
}
