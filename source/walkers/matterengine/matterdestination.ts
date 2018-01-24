import { Destination } from "../walkerworld/destination";
import { MatterWalkerEngine } from "./matterwalkerengine";
import { MatterJunction } from "./matterjunction";
import { World } from "../walkerworld/world";

import * as Matter from "matter-js";



export class MatterDestination  {
    private _destination:Destination;
    private _boundryBody:Matter.Body;
    private _spatialBody:Matter.Body;

    public constructor(world:World,matterEngine:MatterWalkerEngine,destination:Destination) {
		this.destination = destination;
		let j:Matter.Body = this.getMatterJunction(world,matterEngine).getBoundryJunction();;
		//this.spatialBody = this.getMatterJunction(world,matterEngine).getBoundryJunction();
		this.spatialBody = Matter.Bodies.circle(j.position.x,j.position.y,40,
			{
				isSensor:true,
				render:{fillStyle:"red",strokeStyle:"red"},
			},8);
		this.boundryBody = matterEngine.matterTools.createBoundObject(this.spatialBody,1.05,1.5);
		
		//this.spatialBody.render.fillStyle="red";
		this.spatialBody.collisionFilter.category = MatterWalkerEngine.boundrySpatialFilter;
		this.spatialBody.collisionFilter.mask = MatterWalkerEngine.boundsFilter|MatterWalkerEngine.walkerTravleing;
		
		this.boundryBody.collisionFilter.category = MatterWalkerEngine.boundryContainerFilter;
		this.boundryBody.collisionFilter.mask = MatterWalkerEngine.boundsFilter|MatterWalkerEngine.walkerArrived;
		this.boundryBody.restitution = 0.0;
	}

	public getMatterJunction(world:World,matterEngine:MatterWalkerEngine):MatterJunction {
		return(matterEngine.junctions.get(this.destination.getJunction(world).worldId.id));
	}
	
	public addToEngine(world:World,matterEngine:MatterWalkerEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.boundryBody,this.spatialBody]);
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