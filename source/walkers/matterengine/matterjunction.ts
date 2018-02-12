import { Junction } from "../walkerworld/junction";
import { WorldPosition } from "../world/worldposition";
import { MatterWalkerEngine } from "./matterwalkerengine";
import { MatterTools } from "./mattertools";
import { MatterObject } from "./matterobject";
import { WalkerWorld } from "../walkerworld/walkerworld";
import * as Matter from "matter-js";
//import { MatterTools } from "./mattertools";



export class MatterJunction  extends MatterObject {
    private _junction:Junction;
    private _spacerBody:Matter.Body;
    private _junctionBody:Matter.Body;

    public constructor(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine,junction:Junction,worldPosition:WorldPosition) {
		super(junction.worldId);
		let position = MatterTools.getVectorFromWorldPostion(worldPosition);
		
		this.junction = junction;

		this.junctionBody = Matter.Bodies.circle(position.x,position.y,30,{render:{fillStyle:"blue",strokeStyle:"white"}},8);					
		this.junctionBody.collisionFilter.category = MatterWalkerEngine.junctionFilter;
		this.junctionBody.collisionFilter.mask = MatterWalkerEngine.junctionFilter|MatterWalkerEngine.boundsFilter;		

		this.spacerBody = Matter.Bodies.circle(position.x,position.y,60,{render:{fillStyle:"transparent",strokeStyle:"white"}},8);
		this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;
	}

	public getWorldPosition():WorldPosition {
		return( this.bodyPostion2WorldPosition(this.junctionBody) );
	}

	public translate(worldPosition:WorldPosition):void {
		Matter.Body.translate(this.junctionBody,MatterTools.getVectorFromWorldPostion(worldPosition));
		Matter.Body.translate(this.spacerBody,MatterTools.getVectorFromWorldPostion(worldPosition));
	}


	public addToEngine(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine):void {
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









		/**
		let junctionBodyShape:WorldShape = junction.worldObjectDisplay.getShape(junction,Junction.junctionBody);
		this.junctionBody = matterEngine.matterTools.getBodyFromWorldShape(
			new WorldPosition(position.x,position.y),
			junctionBodyShape);
		//this.junctionBody = Matter.Bodies.circle(position.x,position.y,30,{render:{fillStyle:"blue",strokeStyle:"white"}},8);			
		
		this.junctionBody.collisionFilter.category = MatterWalkerEngine.junctionFilter;
		this.junctionBody.collisionFilter.mask = MatterWalkerEngine.junctionFilter|MatterWalkerEngine.boundsFilter;			
*/

/*
		let spacerBodyShape:WorldShape = junction.worldObjectDisplay.getShape(junction,Junction.junctionBody);
		this.spacerBody = matterEngine.matterTools.getBodyFromWorldShape(
			new WorldPosition(position.x,position.y),
			spacerBodyShape);	
		Matter.Body.scale(this.spacerBody,2.0,2.0,this.spacerBody.position);
*/					
	
/*
		matterEngine.matterTools.getVectorArrayFromWorldPostionArray(
				new WorldPosition(position.x,position.y),
				junctionBodyShape.shapePoints)
			);
		var polygon = { 
			label: 'Polygon Body',
			position: { x: x, y: y },
			vertices: Matter.Vertices.
		};

		if (options.chamfer) {
			var chamfer = options.chamfer;
			polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, 
									chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
			delete options.chamfer;
		}

		return Body.create(Common.extend({}, polygon, options));
		*/
		//this.spacerBody = Matter.Bodies.circle(position.x,position.y,60,{render:{fillStyle:"transparent",strokeStyle:"white"}},8);
		//this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		//this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;
		//let spacerPosition = matterEngine.matterTools.getVectorFromWorldPostion(
		//	new WorldPosition(0,0),
		//	new WorldPosition(position.x,position.y));
		/*
		this.spacerBody = Matter.Body.create(
			//Matter.Common.extend({},
			{
				position: { x: position.x, y: position.y },
				vertices: matterEngine.matterTools.getVectorArrayFromWorldPostionArray(
					new WorldPosition(position.x,position.y),
					junctionBodyShape.shapePoints)
			}
			
			{collisionFilter:{
				category:MatterWalkerEngine.junctionSpacerFilter,
				group:0,
				mask:MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter
			}
		}
			
		);
		this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;
		*/
		/*
		Matter.Body.setVertices(
			this.spacerBody,
			matterEngine.matterTools.getVectorArrayFromWorldPostionArray(
				new WorldPosition(position.x,position.y),
				junctionBodyShape.shapePoints)
			);
			*/
		//Matter.Body.scale(this.spacerBody,2.0,2.0,this.spacerBody.position);
		//////////////Matter.Body.translate(this.spacerBody,spacerPosition);
