import { Walker } from "../walker";
import { MatterEngine } from "./matterengine";
//import { MatterEventConsumer } from "./mattereventconsumer";
import { MatterEvent } from "./matterevent";
import { MatterCollisionEvent } from "./mattercollisionevent";
import { MatterDestination } from "./matterdestination";
import { World } from "../world";

import * as Matter from "matter-js";



export class MatterWalker  {
    private _walker:Walker;
    private _walkerBody:Matter.Body;
    private _walker2DestinationSpring:Matter.Constraint	;

    public constructor(world:World,matterEngine:MatterEngine,walker:Walker) {

		this.walker = walker;
		let junctionDensity = matterEngine.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction().density;
		this.walkerBody = Matter.Bodies.circle(350,50,10,
			{render:{fillStyle:"blue",strokeStyle:"blue"},density:junctionDensity/1000},8);
		
		this.walkerBody.restitution = 0.0;
        this.walkerBody.collisionFilter.category = MatterEngine.walkerTravleing;
		this.walkerBody.collisionFilter.mask = 
			//MatterEngine.walkerFilter|
			MatterEngine.walkerTravleing|
			MatterEngine.walkerArrived|			
			MatterEngine.boundsFilter|
			MatterEngine.boundryContainerFilter|
			MatterEngine.boundrySpatialFilter;
  
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
	}


	public getCurrentMaterDestination(matterEngine:MatterEngine) {
		let matterDestination:MatterDestination = 
				matterEngine.destinations.get(this.walker.getCurrentDestination().worldId.id);
		return(matterDestination);

	}

	public addToEngine(world:World,matterEngine:MatterEngine):void {
		Matter.World.add(matterEngine.engine.world,[this.walkerBody]);
		Matter.World.add(matterEngine.engine.world,[this.walker2DestinationSpring]);
		this.enableWalkerEvents(world,matterEngine);
	}

	public walkerArrivedAtDestination(world:World,matterEngine:MatterEngine) : void {
		//console.log("walkerArrivedAtDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterEngine.walkerArrived;
		this.getWalker2DestinationSpring().stiffness = 0.0;
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerArrived;
		
		
	}

	public walkerTravelingTotDestination(world:World,matterEngine:MatterEngine) : void {
		//console.log("walkerTravelingTotDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterEngine.walkerTravleing;
		this.getWalker2DestinationSpring().stiffness = 0.01;
		
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerTravleing;
		
		
	}

	public enableWalkerEvents(world:World,matterEngine:MatterEngine):void {

		let matterWalker:MatterWalker = this;

		let collisionStart:MatterCollisionEvent = 
		function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void{
				let containerDest:Matter.Body =  matterWalker.getCurrentMaterDestination(matterEngine).getWalkerContainer();				
				let isWalkerInisdeContainer:boolean = Matter.Vertices.contains(
					containerDest.vertices,matterWalker.getAreaWalker().position);
				
				if(isWalkerInisdeContainer) matterWalker.walkerArrivedAtDestination(world,matterEngine);
				else matterWalker.walkerTravelingTotDestination(world,matterEngine);


				if(matterEngine.mouseConstraint.body===matterWalker.walkerBody)
				{
					console.log("collisionStart:walker:mouseClick!!");					
				}

			}
			
/*
		let collisionStartx:MatterEventConsumer = new MatterEventConsumer(
			this.walker.worldId,
			this.getAreaWalker(),
			MatterEvent.collisionActive,
			function(event:any) {
				let containerDest:Matter.Body =  matterWalker.getCurrentMaterDestination(matterEngine).getWalkerContainer();				
				let isWalkerInisdeContainer:boolean = Matter.Vertices.contains(
					containerDest.vertices,matterWalker.getAreaWalker().position);
				
				if(isWalkerInisdeContainer) matterWalker.walkerArrivedAtDestination(world,matterEngine);
				else matterWalker.walkerTravelingTotDestination(world,matterEngine);


				if(matterEngine.mouseConstraint.body===matterWalker.walkerBody)
				{
					console.log("collisionStart:walker:mouseClick!!");					
				}
			}
		);
*/
		matterEngine.registerCollisionEvent(this.getAreaWalker(),MatterEvent.collisionActive,collisionStart);
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