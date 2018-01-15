import { Walker } from "../walker";
import { MatterEngine } from "./matterengine";

import { World } from "../world";

import * as Matter from "matter-js";



export class MatterWalker  {
    private _walker:Walker;
    private _walkerBody:Matter.Body;
    private _walker2DestinationSpring:Matter.Constraint	;

    public constructor(world:World,matterEngine:MatterEngine,walker:Walker) {

		this.walker = walker;
		let junctionDensity = matterEngine.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction().density;
		this.walkerBody = Matter.Bodies.circle(350,50,10,{density:junctionDensity/1000},8);
		
        this.walkerBody.collisionFilter.category = MatterEngine.walkerFilter;
        this.walkerBody.collisionFilter.mask = MatterEngine.walkerFilter|MatterEngine.boundsFilter;
  

		this.walker2DestinationSpring = Matter.Constraint.create({
            bodyA: this.getAreaWalker(),
            bodyB: matterEngine.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction(),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
            stiffness:0.001,
          });
		
	}

	public addToEngine(world:World,matterEngine:MatterEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.walkerBody]);
		Matter.World.add(matterEngine.engine.world,[this.walker2DestinationSpring]);
	}
	
	public getAreaWalker():Matter.Body {
		return(this.walkerBody);
	}

	public getWalker2DestinationSpring():Matter.Constraint {
		return(this.walker2DestinationSpring);
	}


	public get walker2DestinationSpring(): Matter.Constraint	 {
		return this._walker2DestinationSpring;
	}

	public set walker2DestinationSpring(value: Matter.Constraint	) {
		this._walker2DestinationSpring = value;
	}
	
	public get walkerBody(): Matter.Body {
		return this._walkerBody;
	}

	public set walkerBody(value: Matter.Body) {
		this._walkerBody = value;
	}


	public get walker(): Walker {
		return this._walker;
	}

	public set walker(value: Walker) {
		this._walker = value;
	}
	

	
    
}