import { Walker } from "../walker";
import { MatterTools } from "./mattertools";
import { Junction } from "../junction";
import { Destination } from "../destination";
import { Path } from "../path";
import { WalkerEngine } from "../walkerengine";
import { World } from "../world";
import { MatterJunction } from "./matterjunction";
import { MatterDestination } from "./matterdestination";
import { MatterWalker } from "./matterwalker";
import { MatterEventConsumer } from "./mattereventconsumer";
import { MatterEvent } from "./matterevent";


import * as Matter from "matter-js";



export class MatterEngine extends WalkerEngine {


	  private _matterTools:MatterTools ;
    private _junctions : Map<string,MatterJunction>;
    private _destinations : Map<string,MatterDestination>;
    private _walkers : Map<string,MatterWalker>;
    private _paths : Map<string,Matter.Constraint>;
    private _eventHandlers : Map<string,MatterEventConsumer>;
    private _engine : Matter.Engine;

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
        this.matterTools = new MatterTools();
        this.junctions = new Map<string,MatterJunction>();
        this.destinations = new Map<string,MatterDestination>();
        this.paths = new Map<string,Matter.Constraint>();    
        this.walkers = new Map<string,MatterWalker>(); 
        this.eventHandlers = new Map<string,MatterEventConsumer>(); 
        
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;
        
        this.enableEvents();

    }

    public registerEventConsumer(matterEventConsumer:MatterEventConsumer):void {
      this.eventHandlers.set(matterEventConsumer.getMapId(),matterEventConsumer);    
    }

    public deregisterEventConsumer(matterEventConsumer:MatterEventConsumer):void {
      this.eventHandlers.delete(matterEventConsumer.getMapId());    
    }

    public hasHandler(body:Matter.Body,eventType:MatterEvent):boolean {
      return(this.eventHandlers.has(MatterEventConsumer.getMapId(body,eventType)))
    }

    public getHandler(body:Matter.Body,eventType:MatterEvent):MatterEventConsumer {
      return( this.eventHandlers.get(MatterEventConsumer.getMapId(body,eventType)) );
    }

    public disableEvents(world:World,matterEngine:MatterEngine):void {
      Matter.Events.off(this,MatterEvent.beforeUpdate,function(event) {});
      Matter.Events.off(this,MatterEvent.collisionActive,function(event) {});	
      Matter.Events.off(this,MatterEvent.collisionEnd,function(event) {});		
      Matter.Events.off(this,MatterEvent.collisionStart,function(event) {});		
      
    }

    public processEngineEvent(eventType:MatterEvent,event:Object):void {
      console.log("processEngineEvent:eventType="+eventType+":event="+event);
    }

    public processPairsEvent(eventType:MatterEvent,event:Object):void {
      var pairs:Array<any> = event["pairs"];
      for(let i=0;i<pairs.length;i++){

        if(this.hasHandler(pairs[i].bodyA,eventType))
          this.getHandler(pairs[i].bodyA,eventType).eventHandler(event);

        if(this.hasHandler(pairs[i].bodyB,eventType))
          this.getHandler(pairs[i].bodyB,eventType).eventHandler(event);
      }
    }

    public processCollisionPairsEvent(eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void {
      var pairs:Matter.IPair[] = event.pairs;
      for(let i=0;i<pairs.length;i++){

        if(this.hasHandler(pairs[i].bodyA,eventType))
          this.getHandler(pairs[i].bodyA,eventType).eventHandler(event);

        if(this.hasHandler(pairs[i].bodyB,eventType))
          this.getHandler(pairs[i].bodyB,eventType).eventHandler(event);
      }
    }
/*
    public processCollisionPairsEvent(eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void {
      var pairs:Matter.IPair[] = event.pairs;
      for(let i=0;i<pairs.length;i++){

        if(this.hasHandler(pairs[i].bodyA,eventType))
          this.getHandler(pairs[i].bodyA,eventType).eventHandler(event);

        if(this.hasHandler(pairs[i].bodyB,eventType))
          this.getHandler(pairs[i].bodyB,eventType).eventHandler(event);
      }
    }
*/

/*
    public processCollisionEvent(materEvent:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void  {      
      if(materEvent===MatterEvent.collisionStart) this.processCollisionPairsEvent(materEvent,event);
      else if(materEvent===MatterEvent.collisionEnd) this.processPairsEvent(materEvent,event);
      else if(materEvent===MatterEvent.collisionActive) this.processPairsEvent(materEvent,event);
    }
*/
    public processTimestampedEvent(materEvent:MatterEvent,event:Matter.IEventTimestamped<Matter.Engine>):void  {      
     //console.log("MatterEngine:processTimestampedEvent"+
     // ":event="+event.name+
     // ":timestamp="+event.timestamp+      
     // "");
    }

    public processCompositeEvent(materEvent:MatterEvent,event: Matter.IEventComposite<Matter.Composite>):void  {      
      //console.log("MatterEngine:processCompositeEvent"+
      // ":event="+event.name+
      // "");
     }

    
/*
    public processEvent(materEvent:MatterEvent,event:Object):void  {
      if(materEvent===MatterEvent.collisionStart) this.processPairsEvent(materEvent,event);
      else if(materEvent===MatterEvent.collisionEnd) this.processPairsEvent(materEvent,event);
      else if(materEvent===MatterEvent.collisionActive) this.processPairsEvent(materEvent,event);
      else if(materEvent===MatterEvent.beforeUpdate) this.processEngineEvent(materEvent,event);
      else if(materEvent===MatterEvent.afterUpdate) this.processEngineEvent(materEvent,event);
      else if(materEvent===MatterEvent.beforeAdd) this.processEngineEvent(materEvent,event);
      else if(materEvent===MatterEvent.afterAdd) this.processEngineEvent(materEvent,event);
    }
*/
    public enableEvents():void {
      let matterEngine:MatterEngine = this;    
      console.log("World:event:enableEvents");			
      
      Matter.Events.on(this.engine,MatterEvent.collisionStart, function(event: Matter.IEventCollision<Matter.Engine>) {   
            matterEngine.processCollisionPairsEvent(MatterEvent.collisionStart,event); });

      Matter.Events.on(this.engine,MatterEvent.collisionEnd, function(event: Matter.IEventCollision<Matter.Engine>) {  
        matterEngine.processCollisionPairsEvent(MatterEvent.collisionEnd,event);  });

      Matter.Events.on(this.engine,MatterEvent.collisionActive, function(event: Matter.IEventCollision<Matter.Engine>) {   
        matterEngine.processCollisionPairsEvent(MatterEvent.collisionActive,event);   });

       Matter.Events.on(this.engine,MatterEvent.beforeUpdate, function(event: Matter.IEventTimestamped<Matter.Engine>) {  
        matterEngine.processTimestampedEvent(MatterEvent.beforeUpdate,event);  });

      Matter.Events.on(this.engine,MatterEvent.afterUpdate, function(event: Matter.IEventComposite<Matter.Composite>) {   
        matterEngine.processCompositeEvent(MatterEvent.afterUpdate,event);  });

      Matter.Events.on(this.engine,MatterEvent.beforeAdd,function(event: Matter.IEventComposite<Matter.Composite>) {      
        matterEngine.processCompositeEvent(MatterEvent.beforeAdd,event);  });

      Matter.Events.on(this.engine,MatterEvent.afterAdd, function(event: Matter.IEventComposite<Matter.Composite>) {    
        matterEngine.processCompositeEvent(MatterEvent.afterAdd,event);   });
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
              length:150,
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
        let mouse = Matter.Mouse.create(render.canvas);
        
        // add mouse control
        let mouseConstraint = Matter.MouseConstraint.create(this.engine);
        mouseConstraint.mouse = mouse;
        mouseConstraint.constraint.render.visible = false;
        mouseConstraint.constraint.stiffness = 0.2;
        
        Matter.World.add(this.engine.world, mouseConstraint);
        
        // keep the mouse in sync with rendering
        render.controller.mouse = mouse;
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
      walls.collisionFilter.category = MatterEngine.boundsFilter;
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
  
    
    public get engine(): Matter.Engine {
		return this._engine;
	}

	public set engine(value: Matter.Engine) {
		this._engine = value;
  }
  

	public get eventHandlers(): Map<string,MatterEventConsumer> {
		return this._eventHandlers;
	}

	public set eventHandlers(value: Map<string,MatterEventConsumer>) {
		this._eventHandlers = value;
	}

	public get matterTools(): MatterTools  {
		return this._matterTools;
	}

	public set matterTools(value: MatterTools ) {
		this._matterTools = value;
	}
  
  
    
}