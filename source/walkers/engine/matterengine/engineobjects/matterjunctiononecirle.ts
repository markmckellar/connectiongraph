//import { Junction } from "../../walkerworld/junction";
import { WorldPosition } from "../../../../world/worldposition";
import { MatterWalkerEngine } from "../matterwalkerengine";
import { MatterTools } from "../../../../engine/matterengine/mattertools";
import { WalkerWorld } from "../../../walkerworld/walkerworld";
import { WorldId } from "../../../../world/worldid";
//import { WorldObjectDisplay } from "../../display/worldobjectdisplay";
//import { MatterEngine } from "../matterengine";
//import { MatterEvent } from "../events/matterevent";
import { MatterCircle } from "../../../../engine/matterengine/shapes/mattercircle";
import { MatterJunction } from "./matterjunction";
import { JunctionOneCircle } from "../../engineobjects/junctiononecircle";
import { EngineObject } from "../../../../engine/engineobjects/engineobject";
import { CircleEngineShape } from "../../../../engine/shapes/circleengineshape";


import * as Matter from "matter-js";
//import { MatterTools } from "./mattertools";



export class MatterJunctionOneCircle  extends MatterJunction implements JunctionOneCircle{
	private _spacerBody:Matter.Body;
	private _junctionBody:Matter.Body;
	private _circle:MatterCircle;

	public constructor(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine,worldId:WorldId,worldPosition:WorldPosition) {
		super(walkerWorld,matterEngine,worldId);
		let position = MatterTools.getVectorFromWorldPostion(worldPosition);
		
		////////////let options:any =  {};//{render:{fillStyle:"blue",strokeStyle:"white"}};
		let curvePoints:number = 8;
		this.circle = new MatterCircle("junctionBody",20,curvePoints,worldPosition,{render:{visable:false}}) ;
		this.circle.circleBody.render.visible = false;
		
		this.junctionBody = this.circle.circleBody;
		this.junctionBody.collisionFilter.category = MatterWalkerEngine.junctionFilter;
		this.junctionBody.collisionFilter.mask = MatterWalkerEngine.junctionFilter|MatterWalkerEngine.boundsFilter;		

		this.spacerBody = Matter.Bodies.circle(position.x,position.y,30,{render:{fillStyle:"transparent",strokeStyle:"white"}},8);
		this.spacerBody.collisionFilter.category = MatterWalkerEngine.junctionSpacerFilter;
		this.spacerBody.collisionFilter.mask = MatterWalkerEngine.junctionSpacerFilter|MatterWalkerEngine.boundsFilter;

		///this.registerRenderer(walkerWorld,matterEngine,junction.worldId,junction.worldObjectDisplay);

		this.addToEngine(walkerWorld,matterEngine);
		
	}

	public getEngineObject():EngineObject {
		return(this);
	}

	public getCircle(): CircleEngineShape {
		return(this.circle);
	}


	public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition(this.junctionBody) );
	}

	public translate(worldPosition:WorldPosition):void {
		Matter.Body.translate(this.junctionBody,MatterTools.getVectorFromWorldPostion(worldPosition));
		Matter.Body.translate(this.spacerBody,MatterTools.getVectorFromWorldPostion(worldPosition));
	}

	/****** 
	public registerRenderer(walkerWorld:WalkerWorld,matterEngine:MatterEngine,worldId:WorldId,worldObjectDisplay:WorldObjectDisplay):void {
	//let matterJunction:MatterJunction = this;	


		matterEngine.registerTimestampedEvent(
			worldId.id,
			MatterEvent.afterRender,
			function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventTimestamped<Matter.Engine>):void{
			  //console.log("afterRender!!!!!!!!!!!!!!!!!!!!");	
			  //walker.worldObjectDisplay.drawObject();
			  let context:CanvasRenderingContext2D = matterEngine.render.context;
			  worldObjectDisplay.drawObject(walkerWorld,context);		  		
			});    
	}
	***********/

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

	private get spacerBody(): Matter.Body {
		return this._spacerBody;
	}

	private set spacerBody(value: Matter.Body) {
		this._spacerBody = value;
	}

	public get junctionBody(): Matter.Body {
		return this._junctionBody;
	}

	public set junctionBody(value: Matter.Body) {
		this._junctionBody = value;
	}

	public get circle(): MatterCircle {
		return this._circle;
	}

	public set circle(value: MatterCircle) {
		this._circle = value;
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
