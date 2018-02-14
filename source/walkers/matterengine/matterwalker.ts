import { Walker } from "../walkerworld/walker";
import { MatterWalkerEngine } from "./matterwalkerengine";
import { MatterEvent } from "./events/matterevent";
import { MatterDestination } from "./matterdestination";
import { WalkerWorld } from "../walkerworld/walkerworld";
import { MatterObject } from "./matterobject";
import { WorldPosition } from "../world/worldposition";
import { MatterTools } from "./mattertools";
import * as Matter from "matter-js";
import { MatterEngine } from "./matterengine";



export class MatterWalker  extends MatterObject {
    private _walkerBody:Matter.Body;
    private _walker2DestinationSpring:Matter.Constraint	;

	public constructor(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine,walker:Walker) {
		super(walker.worldId);

		let junctionDensity = matterEngine.junctions.get(walker.getCurrentJunction(walkerWorld).worldId.id).getAreaJunction().density;
		
		let position:Matter.Vector = this.getCurrentMaterDestination(walker,matterEngine).getSpatialBody().position;
		
		this.walkerBody = Matter.Bodies.circle(position.x,position.y,10,
			{render:{fillStyle:"blue",strokeStyle:"blue"},density:junctionDensity/1000},8);
		
		this.walkerBody.restitution = 0.0;
        this.walkerBody.collisionFilter.category = MatterWalkerEngine.walkerTravleing;
		this.walkerBody.collisionFilter.mask = 
			//MatterEngine.walkerFilter|
			MatterWalkerEngine.walkerTravleing|
			MatterWalkerEngine.walkerArrived|			
			MatterWalkerEngine.boundsFilter|
			MatterWalkerEngine.boundryContainerFilter|
			MatterWalkerEngine.boundrySpatialFilter;
  
		this.walkerBody.frictionAir = 0.5;

		this.walker2DestinationSpring = Matter.Constraint.create({
            bodyA: this.getAreaWalker(),
            bodyB: matterEngine.destinations.get(walker.getCurrentDestination().worldId.id).getSpatialBody(),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
			stiffness:0.0001,
			
		  });
		this.walker2DestinationSpring.render.visible=false;
		this.walkerTravelingTotDestination(walkerWorld,matterEngine);	

		this.registerRenderer(matterEngine,walker);
	}

	public registerRenderer(matterEngine:MatterEngine,walker:Walker):void {
		let matterWalker:MatterWalker = this;
		matterEngine.registerTimestampedEvent(
			walker.worldId.id,
			MatterEvent.afterRender,
			function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventTimestamped<Matter.Engine>):void{
			  //console.log("afterRender!!!!!!!!!!!!!!!!!!!!");	
			  //walker.worldObjectDisplay.drawObject();
			  let context:CanvasRenderingContext2D = matterEngine.render.context;
			  		
			  context.fillStyle = MatterTools.getColorFromString("ffffffff");
			  context.strokeStyle = MatterTools.getColorFromString("0000ffff");

			  context.beginPath();
			  context.arc(matterWalker.walkerBody.position.x,
				matterWalker.walkerBody.position.y,
				10,
				0,Math.PI * 2, false);
			  context.closePath();
			  context.fill();
			  context.lineWidth = 1;
			  context.stroke();
			});    
	}

	public translate(worldPosition:WorldPosition):void {
		Matter.Body.translate(this.walkerBody,MatterTools.getVectorFromWorldPostion(worldPosition));
	}
	
	public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition(this.walkerBody) );
	}
 


	public getCurrentMaterDestination(walker:Walker,matterEngine:MatterWalkerEngine) {
		let matterDestination:MatterDestination = 
				matterEngine.destinations.get(walker.getCurrentDestination().worldId.id);
		return(matterDestination);

	}

	public addToEngine(walker:Walker,walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.walkerBody]);
		Matter.World.add(matterEngine.engine.world,[this.walker2DestinationSpring]);
		this.enableWalkerEvents(walker,walkerWorld,matterEngine);
	}

	public walkerArrivedAtDestination(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine) : void {
		//console.log("walkerArrivedAtDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterWalkerEngine.walkerArrived;
		this.getWalker2DestinationSpring().stiffness = 0.0;
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerArrived;
		
		
	}

	public walkerTravelingTotDestination(walkerWorld:WalkerWorld,matterEngine:MatterWalkerEngine) : void {
		//console.log("walkerTravelingTotDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterWalkerEngine.walkerTravleing;
		this.getWalker2DestinationSpring().stiffness = 0.01;
		
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerTravleing;
		
		
	}

	public enableWalkerEvents(walker:Walker,walkerWorld:WalkerWorld,matterWalkerEngine:MatterWalkerEngine):void {

		let matterWalker:MatterWalker = this;

		matterWalkerEngine.registerCollisionEvent(
			this.getAreaWalker(),
			MatterEvent.collisionActive,
			function(matterEngine:MatterWalkerEngine,eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void{
				let containerDest:Matter.Body =  matterWalker.getCurrentMaterDestination(walker,matterEngine).getWalkerContainer();				
				let isWalkerInisdeContainer:boolean = Matter.Vertices.contains(
					containerDest.vertices,matterWalker.getAreaWalker().position);
				
				if(isWalkerInisdeContainer) matterWalker.walkerArrivedAtDestination(walkerWorld,matterEngine);
				else matterWalker.walkerTravelingTotDestination(walkerWorld,matterEngine);


				if(matterEngine.mouseConstraint.body===matterWalker.walkerBody)
				{
					console.log("collisionStart:walker:mouseClick!!");					
				}

			});
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
}