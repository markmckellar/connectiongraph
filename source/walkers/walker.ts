import { Destination } from "./destination";
import { WorldObject } from "./worldobject";
import { Junction } from "./junction";
import { WorldId } from "./worldid";
import { World } from "./world";



export class Walker extends WorldObject {
    private _currentDestination: Destination;

    public constructor(worldId:WorldId,junction:Junction) {
        super(worldId);
		this.currentDestination = junction.getWalkerDestination(this);
	}

	public isCurrentJunction(world:World,junction:Junction):boolean {
		console.log("Walker:isCurrentJunction.junction="+junction.worldId.id);
		console.log("Walker:isCurrentJunction.current.junction.tDestination="+
			this.currentDestination.getJunction(world).worldId.id);
		console.log("Walker:isCurrentJunction="+
			(this.currentDestination.getJunction(world).worldId.id!==junction.worldId.id));

		return(this.currentDestination.getJunction(world).worldId.id===junction.worldId.id)	
	}

	public getCurrentJunction(world:World,): Junction {
		return this._currentDestination.getJunction(world);
	}

    public get currentDestination(): Destination {
		return this._currentDestination;
	}

	public set currentDestination(value: Destination) {
		this._currentDestination = value;
	}
}
