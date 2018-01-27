import { Walker } from "../walkerworld/walker";
import { MatterWalkerEngine } from "./matterwalkerengine";
import { MatterEvent } from "./matterevent";
import { MatterDestination } from "./matterdestination";
import { World } from "../walkerworld/world";

import * as Matter from "matter-js";
import { MatterEngine } from "./matterengine";



export class MatterWalker  {
    private _walker:Walker;
    private _walkerBody:Matter.Body;
    private _walker2DestinationSpring:Matter.Constraint	;

    public constructor(world:World,matterEngine:MatterWalkerEngine,walker:Walker) {

		this.walker = walker;
		let junctionDensity = matterEngine.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction().density;
		
		let position:Matter.Vector = this.getCurrentMaterDestination(matterEngine).getSpatialBody().position;
		
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
            bodyB: matterEngine.destinations.get(this.walker.getCurrentDestination().worldId.id).getSpatialBody(),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
			stiffness:0.0001,
			
		  });
		this.walker2DestinationSpring.render.visible=false;
		this.walkerTravelingTotDestination(world,matterEngine);	

		this.registerRenderer(matterEngine);
	}

	public registerRenderer(matterEngine:MatterEngine):void {
		let matterWalker:MatterWalker = this;
		matterEngine.registerTimestampedEvent(
			this.walker.worldId.id,
			MatterEvent.afterRender,
			function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventTimestamped<Matter.Engine>):void{
			  //console.log("afterRender!!!!!!!!!!!!!!!!!!!!");	
			  let context:CanvasRenderingContext2D = matterEngine.render.context;
			  		
			  context.fillStyle = matterEngine.matterTools.getColorFromString("ffffffff");
			  context.strokeStyle = matterEngine.matterTools.getColorFromString("0000ffff");

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


	public getCurrentMaterDestination(matterEngine:MatterWalkerEngine) {
		let matterDestination:MatterDestination = 
				matterEngine.destinations.get(this.walker.getCurrentDestination().worldId.id);
		return(matterDestination);

	}

	public addToEngine(world:World,matterEngine:MatterWalkerEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.walkerBody]);
		Matter.World.add(matterEngine.engine.world,[this.walker2DestinationSpring]);
		this.enableWalkerEvents(world,matterEngine);
	}

	public walkerArrivedAtDestination(world:World,matterEngine:MatterWalkerEngine) : void {
		//console.log("walkerArrivedAtDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterWalkerEngine.walkerArrived;
		this.getWalker2DestinationSpring().stiffness = 0.0;
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerArrived;
		
		
	}

	public walkerTravelingTotDestination(world:World,matterEngine:MatterWalkerEngine) : void {
		//console.log("walkerTravelingTotDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterWalkerEngine.walkerTravleing;
		this.getWalker2DestinationSpring().stiffness = 0.01;
		
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerTravleing;
		
		
	}

	public enableWalkerEvents(world:World,matterWalkerEngine:MatterWalkerEngine):void {

		let matterWalker:MatterWalker = this;

		matterWalkerEngine.registerCollisionEvent(
			this.getAreaWalker(),
			MatterEvent.collisionActive,
			function(matterEngine:MatterWalkerEngine,eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void{
				let containerDest:Matter.Body =  matterWalker.getCurrentMaterDestination(matterEngine).getWalkerContainer();				
				let isWalkerInisdeContainer:boolean = Matter.Vertices.contains(
					containerDest.vertices,matterWalker.getAreaWalker().position);
				
				if(isWalkerInisdeContainer) matterWalker.walkerArrivedAtDestination(world,matterEngine);
				else matterWalker.walkerTravelingTotDestination(world,matterEngine);


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


	public get walker(): Walker {
		return this._walker;
	}

	public set walker(value: Walker) {
		this._walker = value;
	}
	

	
    
}