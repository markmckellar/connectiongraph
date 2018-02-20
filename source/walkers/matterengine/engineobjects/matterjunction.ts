//import { Junction } from "../../walkerworld/junction";
import { WorldPosition } from "../../world/worldposition";
import { WorldId } from "../../world/worldid";
//import { WorldObjectDisplay } from "../../display/worldobjectdisplay";
import { MatterWalkerEngine } from "../matterwalkerengine";
import { MatterObject } from "./matterobject";
import { WalkerWorld } from "../../walkerworld/walkerworld";
//import { MatterEngine } from "../matterengine";
import * as Matter from "matter-js";
//import { MatterTools } from "./mattertools";



export abstract class MatterJunction  extends MatterObject {

    public constructor(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine,worldId:WorldId) {
		super(worldId);		
		
		//////////this.registerRenderer(walkerWorld,matterEngine,worldId,worldObjectDisplay);
		//this.addToEngine(walkerWorld,matterEngine);
	}

	public abstract getWorldPosition():WorldPosition

	public abstract translate(worldPosition:WorldPosition):void;

	//////////public abstract registerRenderer(walkerWorld:WalkerWorld,matterEngine:MatterEngine,worldId:WorldId,worldObjectDisplay:WorldObjectDisplay):void;

	public abstract addToEngine(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine):void;
	
	public abstract getAreaJunction():Matter.Body;

	public abstract getBoundryJunction():Matter.Body;

    
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
