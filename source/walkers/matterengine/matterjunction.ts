import { Junction } from "../walkerworld/junction";
import { MatterWalkerEngine } from "./matterwalkerengine";

import { World } from "../walkerworld/world";

import * as Matter from "matter-js";



export class MatterJunction  {
    private _junction:Junction;
    private _spacerBody:Matter.Body;
    private _junctionBody:Matter.Body;

    public constructor(world:World,matterEngine:MatterWalkerEngine,junction:Junction) {
		this.junction = junction;
		this.junctionBody = Matter.Bodies.circle(350,50,40,{render:{fillStyle:"blue",strokeStyle:"white"}},8);
		this.spacerBody = Matter.Bodies.circle(350,50,70,{render:{fillStyle:"transparent",strokeStyle:"white"}},8);

		this.junctionBody.collisionFilter.category = MatterWalkerEngine.junctionFilter;
		this.junctionBody.collisionFilter.mask = MatterWalkerEngine.junctionFilter|MatterWalkerEngine.boundsFilter;
		
		this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;
	}

	public addToEngine(world:World,matterEngine:MatterWalkerEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.spacerBody,this.junctionBody]);
		matterEngine.pin(this.spacerBody,this.junctionBody);		
	}
	
	public getAreaJunction():Matter.Body {
		return(this.spacerBody);
	}

	public getBoundryJunction():Matter.Body {
		return(this.junctionBody);
	}

	public get junction(): Junction {
		return this._junction;
	}

	public set junction(value: Junction) {
		this._junction = value;
	}

	private get spacerBody(): Matter.Body {
		return this._spacerBody;
	}

	private set spacerBody(value: Matter.Body) {
		this._spacerBody = value;
	}

	private get junctionBody(): Matter.Body {
		return this._junctionBody;
	}

	private set junctionBody(value: Matter.Body) {
		this._junctionBody = value;
	}
    
}