import { Walker } from "../walker";
import { MatterEngine } from "./matterengine";
import { MatterEventConsumer } from "./mattereventconsumer";
import { MatterEvent } from "./matterevent";

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
		this.walkerBody = Matter.Bodies.circle(350,50,10,{density:junctionDensity/1000},8);
		
        this.walkerBody.collisionFilter.category = MatterEngine.walkerTravleing;
		this.walkerBody.collisionFilter.mask = 
			MatterEngine.walkerFilter|
			//MatterEngine.walkerTravleing|
			//MatterEngine.walkerArrived|			
			MatterEngine.boundsFilter|
			MatterEngine.boundryContainerFilter|
			MatterEngine.boundrySpatialFilter;
  

		this.walker2DestinationSpring = Matter.Constraint.create({
            bodyA: this.getAreaWalker(),
            bodyB: matterEngine.destinations.get(this.walker.getCurrentDestination().worldId.id).getSpatialBody(),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
            stiffness:0.001,
          });
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
		console.log("walkerArrivedAtDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterEngine.walkerArrived;
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerArrived;
		
		
	}

	public walkerTravelingTotDestination(world:World,matterEngine:MatterEngine) : void {
		console.log("walkerTravelingTotDestination:walker="+this.walker.worldId.id+":arrived!");
		this.getAreaWalker().collisionFilter.category  = MatterEngine.walkerTravleing;
		//this.getAreaWalker().collisionFilter.category  |= ~MatterEngine.walkerTravleing;
		
		
	}

	public enableWalkerEvents(world:World,matterEngine:MatterEngine):void {

		let matterWalker:MatterWalker = this;

		let collisionStart:MatterEventConsumer = new MatterEventConsumer(
			this.walker.worldId,
			this.getAreaWalker(),
			MatterEvent.collisionActive,
			function(event:any) {
				var pairs = event.pairs;
				//console.log("collisionStart:walker="+matterWalker.walker.worldId.id+":pairs.length="+pairs.length);
				for (var i = 0, j = pairs.length; i != j; ++i) {
					var pair = pairs[i];

					let spiatailDest:Matter.Body =  matterWalker.getCurrentMaterDestination(matterEngine).getSpatialBody();
					let containerDest:Matter.Body =  matterWalker.getCurrentMaterDestination(matterEngine).getWalkerContainer();
					
					let isWalkerInisdeContainer:boolean = Matter.Vertices.contains(
						containerDest.vertices,matterWalker.getAreaWalker().position);
					
					// it is outside of the diestinationbounds

					/*
					console.log("collisionStart:walker="+matterWalker.walker.worldId.id+
						":pairs.length="+pairs.length+
						":walker="+(pair.bodyA===matterWalker.getAreaWalker() || pair.bodyB===matterWalker.getAreaWalker())+
						":dest="+(pair.bodyA===spiatailDest || pair.bodyB===spiatailDest)+
						":cont="+(pair.bodyA===containerDest || pair.bodyB===containerDest) +
						":incint="+isWalkerInisdeContainer+
						":spacv="+spiatailDest+
						":contv="+containerDest+
						
						"");	
					*/

					if( (pair.bodyA===spiatailDest || pair.bodyB===spiatailDest) ) {
						if(!isWalkerInisdeContainer) matterWalker.walkerArrivedAtDestination(world,matterEngine);
						//else matterWalker.walkerTravelingTotDestination(world,matterEngine);
					}

					if( (pair.bodyA===containerDest || pair.bodyB===containerDest) ) {
						if(!isWalkerInisdeContainer) matterWalker.walkerTravelingTotDestination(world,matterEngine);
						//else matterWalker.walkerTravelingTotDestination(world,matterEngine);
					}
				}
			}
		);

		matterEngine.registerEventConsumer(collisionStart);
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