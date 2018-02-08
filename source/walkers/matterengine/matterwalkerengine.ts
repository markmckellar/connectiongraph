import { Walker } from "../walkerworld/walker";
import { Junction } from "../walkerworld/junction";
import { Destination } from "../walkerworld/destination";
import { WorldPosition } from "../walkerworld/worldposition";

import { Path } from "../walkerworld/path";
import { WalkerEngine } from "../engine/walkerengine";
import { World } from "../walkerworld/world";
import { MatterJunction } from "./matterjunction";
import { MatterDestination } from "./matterdestination";
import { MatterWalker } from "./matterwalker";
import { MatterEngine } from "./matterengine";
//import { MatterEvent } from "./matterevent";

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

      /*
      this.registerCompositeEvent(
        "junctionSpacer",
        MatterEvent.afterUpdate,
        function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventComposite<Matter.Composite>):void{
        // console.log("junctionSpacer!!!!!!!!!!!!!!!!!!!!");					
        });

        
      this.registerTimestampedEvent(
        "beforeRender",
        MatterEvent.beforeRender,
        function(matterEngine:MatterEngine,eventType:MatterEvent,event: Matter.IEventTimestamped<Matter.Engine>):void{
          //console.log("beforeRender!!!!!!!!!!!!!!!!!!!!");					
        });
*/
       
      
  
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
          //let endPosition:Matter.Vector = (this.hasJunction(world,path.endJunction)) ? null : null;
          //this.addJunction(world,path.startJunction,);
          let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.worldId.id).getAreaJunction();
          
          this.addJunctionMatterPosition(world,path.endJunction,
            matterStartJunction.position);

          let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.worldId.id).getAreaJunction();
          
          let matterPath = Matter.Constraint.create({
              bodyA: matterStartJunction,
              bodyB: matterEndJunction,  
              pointA: { x: -0, y: -0 },
              pointB: { x: -0, y: -0 },
              length:59,
              stiffness:0.01,
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

    public hasJunction(junction:Junction):boolean {
      return(this.junctions.has(junction.worldId.id));
    }

    public getMatterJunction(junction:Junction):MatterJunction {
      return(this.junctions.get(junction.worldId.id));
    }

    public getJunctionPosition(junction:Junction):WorldPosition {
      return( this.vectorToPosition(this.getMatterJunction(junction).getAreaJunction().position) );                       
  
    }

    public setJunctionPosition(junction:Junction,position:WorldPosition):void{
      this.getMatterJunction(junction).setPosition(this,position);
    }
    

    public vectorToPosition(vector:Matter.Vector):WorldPosition {
      return( new WorldPosition(vector.x,vector.y));
    }

    public addJunction(world:World,junction:Junction,position:WorldPosition):void {
      this.addJunctionMatterPosition(world,junction,Matter.Vector.create(position.x,position.y));                       
  
    }
    

    public addJunctionMatterPosition(world:World,junction:Junction,position:Matter.Vector):void {
      if(!this.hasJunction(junction))
      {
              let matterJunction = new MatterJunction(world,this,junction,position);      
              this.junctions.set(junction.worldId.id,matterJunction);
              matterJunction.addToEngine(world,this);                       
      }
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