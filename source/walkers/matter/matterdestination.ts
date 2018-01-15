import { Destination } from "../destination";
import { MatterEngine } from "./matterengine";
import { MatterJunction } from "./matterjunction";

import { World } from "../world";

import * as Matter from "matter-js";



export class MatterDestination  {
    private _destination:Destination;
    private _boundryBody:Matter.Body;
    private _spatialBody:Matter.Body;

    public constructor(world:World,matterEngine:MatterEngine,destination:Destination) {
		this.destination = destination;
		
		this.spatialBody = this.getMatterJunction(world,matterEngine).getBoundryJunction();
		this.boundryBody = matterEngine.createBoundObject(this.spatialBody,1.05,1.5);
		
		this.spatialBody.collisionFilter.category = MatterEngine.boundrySpatialFilter;
		this.spatialBody.collisionFilter.mask = MatterEngine.boundsFilter;
		
		this.boundryBody.collisionFilter.category = MatterEngine.boundryContainerFilter;
		this.boundryBody.collisionFilter.mask = MatterEngine.boundsFilter;
	}

	public getMatterJunction(world:World,matterEngine:MatterEngine):MatterJunction {
		return(matterEngine.junctions.get(this.destination.getJunction(world).worldId.id));
	}
	
	public addToEngine(world:World,matterEngine:MatterEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.boundryBody]);
		matterEngine.pin(this.boundryBody,this.getMatterJunction(world,matterEngine).getBoundryJunction());		
		matterEngine.pin(this.spatialBody,this.getMatterJunction(world,matterEngine).getBoundryJunction());			
		
	}
	
	public getSpatialBody():Matter.Body {
		return(this.spatialBody);
	}

	public getWalkerContainer():Matter.Body {
		return(this.boundryBody);
	}

	public get destination(): Destination {
		return this._destination;
	}

	public set destination(value: Destination) {
		this._destination = value;
	}


	private get spatialBody(): Matter.Body {
		return this._spatialBody;
	}

	private set spatialBody(value: Matter.Body) {
		this._spatialBody = value;
	}
	

	private get boundryBody(): Matter.Body {
		return this._boundryBody;
	}

	private set boundryBody(value: Matter.Body) {
		this._boundryBody = value;
	}

    
}