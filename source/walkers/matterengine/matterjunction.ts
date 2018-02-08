import { Junction } from "../walkerworld/junction";
import { WorldPosition } from "../walkerworld/worldposition";

import { MatterWalkerEngine } from "./matterwalkerengine";

import { WorldShape } from "../renderer/shapes/worldshape";
import { World } from "../walkerworld/world";

import * as Matter from "matter-js";
//import { MatterTools } from "./mattertools";



export class MatterJunction  {
    private _junction:Junction;
    private _spacerBody:Matter.Body;
    private _junctionBody:Matter.Body;

    public constructor(world:World,matterEngine:MatterWalkerEngine,junction:Junction,position:Matter.Vector) {
		this.junction = junction;
		
		let junctionBodyShape:WorldShape = junction.worldObjectDisplay.getShape(junction,Junction.junctionBody);
		this.junctionBody = matterEngine.matterTools.getBodyFromWorldShape(
			new WorldPosition(position.x,position.y),
			junctionBodyShape);
		//this.junctionBody = Matter.Bodies.circle(position.x,position.y,30,{render:{fillStyle:"blue",strokeStyle:"white"}},8);			
		this.junctionBody.collisionFilter.category = MatterWalkerEngine.junctionFilter;
		this.junctionBody.collisionFilter.mask = MatterWalkerEngine.junctionFilter|MatterWalkerEngine.boundsFilter;			


/*
		let spacerBodyShape:WorldShape = junction.worldObjectDisplay.getShape(junction,Junction.junctionBody);
		this.spacerBody = matterEngine.matterTools.getBodyFromWorldShape(
			new WorldPosition(position.x,position.y),
			spacerBodyShape);	
		Matter.Body.scale(this.spacerBody,2.0,2.0,this.spacerBody.position);
*/					
	
		//this.spacerBody = Matter.Bodies.circle(position.x,position.y,60,{render:{fillStyle:"transparent",strokeStyle:"white"}},8);
		//this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		//this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;
		let spacerPosition = matterEngine.matterTools.getVectorFromWorldPostion(
			new WorldPosition(0,0),
			new WorldPosition(position.x,position.y));
		this.spacerBody = Matter.Body.create(
			{}
			/*
			{collisionFilter:{
				category:MatterWalkerEngine.junctionSpacerFilter,
				group:0,
				mask:MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter
			}
		}
			*/
		);
		Matter.Body.setVertices(
			this.spacerBody,
			matterEngine.matterTools.getVectorArrayFromWorldPostionArray(
				new WorldPosition(position.x,position.y),
				junctionBodyShape.shapePoints)
			);
		Matter.Body.scale(this.spacerBody,2.0,2.0,spacerPosition);
		Matter.Body.translate(this.spacerBody,spacerPosition);

			

	}

	public setPosition(matterEngine:MatterWalkerEngine,position:WorldPosition):void {
		//position.x = 700;
		//position.y = 500;
		//Matter.Body.setPosition(this.junctionBody,Matter.Vector.create(position.x,position.y));
		//Matter.Body.setPosition(this.spacerBody,Matter.Vector.create(position.x,position.y));
		

		Matter.Body.translate(this.junctionBody,matterEngine.matterTools.getVectorFromWorldPostion(new WorldPosition(0,0),position));
		Matter.Body.translate(this.spacerBody,matterEngine.matterTools.getVectorFromWorldPostion(new WorldPosition(0,0),position));
	}

	public addToEngine(world:World,matterEngine:MatterWalkerEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.spacerBody,this.junctionBody]);
		matterEngine.pin(this.spacerBody,this.junctionBody);

		this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;		
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