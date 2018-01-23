import { Walker } from "../walker";
import { Junction } from "../junction";
import { Destination } from "../destination";
import { Path } from "../path";
import { WalkerEngine } from "../walkerengine";
import { World } from "../world";
import { MatterJunction } from "./matterjunction";
import { MatterDestination } from "./matterdestination";
import { MatterWalker } from "./matterwalker";
import { MatterEngine } from "./matterengine";
import { MatterEvent } from "./matterevent";

import * as Matter from "matter-js";

export class MatterWalkerEngine extends MatterEngine implements WalkerEngine {
    private _junctions : Map<string,MatterJunction>;
    private _destinations : Map<string,MatterDestination>;
    private _walkers : Map<string,MatterWalker>;
    private _paths : Map<string,Matter.Constraint>;

    public static boundsFilter:number = 1;//0x0001;
    public static walkerFilter:number = 2;
    public static junctionSpacerFilter:number = 4;
    public static junctionFilter:number = 8;
    public static boundryContainerFilter:number = 16;
    public static boundrySpatialFilter:number = 32;
    public static walkerTravleing:number = 64;
    public static walkerArrived:number = 128;

    public constructor() {
        super();

        this.junctions = new Map<string,MatterJunction>();
        this.destinations = new Map<string,MatterDestination>();
        this.paths = new Map<string,Matter.Constraint>();    
        this.walkers = new Map<string,MatterWalker>(); 
        
        this.registerWalkerEvents();
    }

    public registerWalkerEvents():void {

      this.registerCompositeEvent(
        "junctionSpacer",
        MatterEvent.afterUpdate,
        function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventComposite<Matter.Composite>):void{
         //console.log("junctionSpacer!!!!!!!!!!!!!!!!!!!!");					
        });
  
    }
    

    public addPath(world:World,path:Path):void {    
      if(!this.paths.has(path.worldId.id))
      {
        if(this.paths.has(Path.getPathId(path.endJunction,path.startJunction).id))
        {
          this.paths.set(path.worldId.id,
            this.paths.get(Path.getPathId(path.endJunction,path.startJunction).id) );
        }
        else
        {
          this.addJunction(world,path.startJunction);
          this.addJunction(world,path.endJunction);

          let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.worldId.id).getAreaJunction();
          let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.worldId.id).getAreaJunction();
          
          let matterPath = Matter.Constraint.create({
              bodyA: matterStartJunction,
              bodyB: matterEndJunction,  
              pointA: { x: -0, y: -0 },
              pointB: { x: -0, y: -0 },
              length:60,
              stiffness:0.0001,
            });
          this.paths.set(path.worldId.id,matterPath);
        
          Matter.World.add(this.engine.world,[matterPath]);           
        } 
      }
    }

    public changeWalkerDestination(world:World,walker:Walker,destination:Destination):void{
      let matterWalker:MatterWalker = this.walkers.get(walker.worldId.id);

      matterWalker.getWalker2DestinationSpring().bodyB =  
          matterWalker.getCurrentMaterDestination(this).getSpatialBody();;

      matterWalker.walkerTravelingTotDestination(world,this);
    }       
    
    public addWalker(world:World,walker:Walker):void { 
      if(!this.walkers.has(walker.worldId.id))
      {
        let matterWalker:MatterWalker = new MatterWalker(world,this,walker);
        this.walkers.set(walker.worldId.id,matterWalker);
        matterWalker.addToEngine(world,this);
      }
    }

    public addDestination(world:World,destination:Destination):void { 
      if(!this._destinations.has(destination.worldId.id))
      {
        let matterDestination = new MatterDestination(world,this,destination);
        this.destinations.set(destination.worldId.id,matterDestination);
        matterDestination.addToEngine(world,this);         
      }
    }

    

    public addJunction(world:World,junction:Junction):void {
      if(!this.junctions.has(junction.worldId.id))
      {
              let matterJunction = new MatterJunction(world,this,junction);      
              this.junctions.set(junction.worldId.id,matterJunction);
              matterJunction.addToEngine(world,this);                       
      }
    }


    public initMouse(render:Matter.Render):void {
        this.mouse = Matter.Mouse.create(render.canvas);
        this.mouseConstraint = Matter.MouseConstraint.create(this.engine);
        this.mouseConstraint.mouse = this.mouse;
        this.mouseConstraint.constraint.render.visible = false;
        this.mouseConstraint.constraint.stiffness = 0.2;
        
        Matter.World.add(this.engine.world, this.mouseConstraint);        
        // keep the mouse in sync with rendering
        render.controller.mouse = this.mouse;
    }

    public isWalkerAtDestination(world:World,walker:Walker):void {
      //let matterDestination = this.destinations.get(walker.getCurrentDestination().worldId.id);      
    }       
    
    public pin(bodyA:Matter.Body,bodyB:Matter.Body):void {
      let pin = Matter.Constraint.create({
              bodyA: bodyA,
              bodyB: bodyB,  
            });
  
      Matter.World.add(this.engine.world,[pin]);
    }
    
    public createBounds(width:number,height:number):void {
      let wallBoundsRect = Matter.Bodies.rectangle(width/2,height/2,width,height,{});
      let walls:Matter.Body = this.matterTools.createBoundObject(wallBoundsRect,1,10);
      walls.collisionFilter.category = MatterWalkerEngine.boundsFilter;
      walls.restitution = 1.0;
      Matter.Body.setStatic(walls,true);
      Matter.World.add(this.engine.world, [walls]);
      
      
  
    }

    public get junctions(): Map<string,MatterJunction> {
		return this._junctions;
	}

	public set junctions(value: Map<string,MatterJunction>) {
		this._junctions = value;
    }
    
    public get paths(): Map<string,Matter.Constraint> {
		return this._paths;
	}

	public set paths(value: Map<string,Matter.Constraint>) {
		this._paths = value;
    }

    public get walkers(): Map<string,MatterWalker> {
		return this._walkers;
	}

	public set walkers(value: Map<string,MatterWalker>) {
		this._walkers = value;
  }
  

	public get destinations(): Map<string,MatterDestination> {
		return this._destinations;
	}

	public set destinations(value: Map<string,MatterDestination>) {
		this._destinations = value;
	}
  
    
  

    
}