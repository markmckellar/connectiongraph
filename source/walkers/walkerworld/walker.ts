import { Destination } from "./destination";
import { WorldObject } from "../world/worldobject";
import { Junction } from "./junction";
import { WorldId } from "../world/worldid";
import {WalkerWorld } from "./walkerworld";
import { WorldObjectDisplay } from "../display/worldobjectdisplay";




export class Walker extends WorldObject {
	private _currentDestination: Destination;
	private _travelingToDestination:boolean;

    public constructor(worldId:WorldId,junction:Junction,worldObjectDisplay:WorldObjectDisplay) {
		super(worldId,worldObjectDisplay);
		this.travelingToDestination = true;
		this.currentDestination = junction.getWalkerDestination(this);
	}

	public isAtDesination(walkerworld:WalkerWorld):boolean{
		return(false);
	}

	public isCurrentJunction(walkerworld:WalkerWorld,junction:Junction):boolean {
		//console.log("Walker:isCurrentJunction.junction="+junction.worldId.id);
		//console.log("Walker:isCurrentJunction.current.junction.tDestination="+
		//	this.currentDestination.getJunction(world).worldId.id);
		//console.log("Walker:isCurrentJunction="+
		//	(this.currentDestination.getJunction(world).worldId.id!==junction.worldId.id));

		return(this.currentDestination.getJunction(walkerworld).worldId.id===junction.worldId.id)	
	}

	public setCurrentDestination(walkerworld:WalkerWorld,destination:Destination):void {
		this.currentDestination = destination;
		walkerworld.walkerEngine.changeWalkerDestination(walkerworld,this,this.currentDestination);
	}

	public getCurrentJunction(walkerworld:WalkerWorld): Junction {
		return this._currentDestination.getJunction(walkerworld);
	}

	public getCurrentDestination(): Destination {
		return this.currentDestination;
	}

    private get currentDestination(): Destination {
		return this._currentDestination;
	}

	private set currentDestination(value: Destination) {
		this._currentDestination = value;
	}

	public get travelingToDestination(): boolean {
		return this._travelingToDestination;
	}

	public set travelingToDestination(value: boolean) {
		this._travelingToDestination = value;
	}
	
}
