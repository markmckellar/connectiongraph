import { MatterTools } from "./mattertools";
import { World } from "../walkerworld/world";
import { MatterEvent } from "./matterevent";
import { MatterCollisionEvent } from "./mattercollisionevent";
import { MatterCompositeEvent } from "./mattercompositeevent";

import * as Matter from "matter-js";

export class MatterEngine  {
    private _matterTools:MatterTools ;
    private _collisionEventHandlers : Map<string,MatterCollisionEvent>;
    private _compositeEventHandlers : Map<string,MatterCompositeEvent>;
    private _engine : Matter.Engine;
    private _mouse:Matter.Mouse;
    private _mouseConstraint:Matter.MouseConstraint;

    public constructor() {
        this.matterTools = new MatterTools();
        this.collisionEventHandlers = new Map<string,MatterCollisionEvent>(); 
        this.compositeEventHandlers = new Map<string,MatterCompositeEvent>();
        
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;

        this.enableEvents();
    }

    private getCompositeEventMapId(name:string,eventType:MatterEvent):string {
      return(name+":"+eventType);
    }

      public registerCompositeEvent(name:string,eventType:MatterEvent,event:MatterCompositeEvent):void {
        this.compositeEventHandlers.set(this.getCompositeEventMapId(name,eventType),event);    
        console.log("MatterEngine:registerCompositeEvent:.keys.length="+this.compositeEventHandlers.keys.length);
      }
  
      public deregisterCompositeEvent(name:string,eventType:MatterEvent,event:MatterCompositeEvent):void {
        this.compositeEventHandlers.delete(this.getCompositeEventMapId(name,eventType));    
      }
  
      /*
      private hasCompositeHandler(name:string,eventType:MatterEvent):boolean {
        return(this.compositeEventHandlers.has(this.getCompositeEventMapId(name,eventType)));
      }
  
      private getCompositeHandler(name:string,eventType:MatterEvent):MatterCompositeEvent {
        return( this.compositeEventHandlers.get(this.getCompositeEventMapId(name,eventType)) );
      }      
      */

      private getCollisionEventMapId(body:Matter.Body,eventType:MatterEvent):string {
        return(body.id+":"+eventType);
      }
  
      public registerCollisionEvent(body:Matter.Body,eventType:MatterEvent,event:MatterCollisionEvent):void {
        this.collisionEventHandlers.set(this.getCollisionEventMapId(body,eventType),event);    
      }
  
      public deregisterCollisionEvent(body:Matter.Body,eventType:MatterEvent,event:MatterCollisionEvent):void {
        this.collisionEventHandlers.delete(this.getCollisionEventMapId(body,eventType));    
      }
  
      public hasCollisionHandler(body:Matter.Body,eventType:MatterEvent):boolean {
        return(this.collisionEventHandlers.has(this.getCollisionEventMapId(body,eventType)))
      }
  
      public getCollisionHandler(body:Matter.Body,eventType:MatterEvent):MatterCollisionEvent {
        return( this.collisionEventHandlers.get(this.getCollisionEventMapId(body,eventType)) );
      }
  
      public disableEvents(world:World,matterEngine:MatterEngine):void {
        // what does the function passed to deregistger an event even mean?!?!?
        Matter.Events.off(this,MatterEvent.beforeUpdate,function(event) {});
        Matter.Events.off(this,MatterEvent.collisionActive,function(event) {});	
        Matter.Events.off(this,MatterEvent.collisionEnd,function(event) {});		
        Matter.Events.off(this,MatterEvent.collisionStart,function(event) {});		      
      }
  
      private processCollisionPairsEvent(eventType:MatterEvent,event: Matter.IEventCollision<Matter.Engine>):void {
        var pairs:Matter.IPair[] = event.pairs;
        for(let i=0;i<pairs.length;i++){
          // TODO this is the collision loop...  we can probably drop from 4 hash lookps to 2
          if(this.hasCollisionHandler(pairs[i].bodyA,eventType))
            this.getCollisionHandler(pairs[i].bodyA,eventType)(this,eventType,event);
  
          if(this.hasCollisionHandler(pairs[i].bodyB,eventType))
            this.getCollisionHandler(pairs[i].bodyB,eventType)(this,eventType,event);
        }
      }
  
      private processTimestampedEvent(eventType:MatterEvent,event:Matter.IEventTimestamped<Matter.Engine>):void  {      
       //console.log("MatterEngine:processTimestampedEvent"+
       // ":event="+event.name+
       // ":timestamp="+event.timestamp+      
       // "");
      }
  
      private processCompositeEvent(eventType:MatterEvent,event: Matter.IEventComposite<Matter.Composite>):void  {  


        let keys = Array.from(  this.compositeEventHandlers.keys() );
        //console.log("MatterEngine:processCompositeEvent:yes.length="+keys.length);
        for(let i=0;i<keys.length;i++ ){
          let name:string = keys[i];
          //console.log("-----MasterEngine:processCompositeEvent:looking at:name="+name);
          
          if(name.endsWith(eventType)) {
            //console.log("----------MatterEngine:processCompositeEvent:has:name="+name);
            let handler:MatterCompositeEvent =  this.compositeEventHandlers.get(name);
            handler(this,eventType,event);
          }          
        }

        for(let name in this.compositeEventHandlers.keys){
          console.log("MatterEngine:processCompositeEvent:name="+name);
          let handler:MatterCompositeEvent = this.compositeEventHandlers.get(name);
          handler(this,eventType,event);
        } 
        
       }
  
       public enableEvents():void {
        console.log("World:event:enableEvents")
        let me:MatterEngine = this;
  
        Matter.Events.on(this.engine,MatterEvent.collisionStart,
          function(event:Matter.IEventCollision<Matter.Engine>)
          { me.processCollisionPairsEvent(MatterEvent.collisionStart,event) } ); 
        
        Matter.Events.on(this.engine,MatterEvent.collisionEnd,
          function(event:Matter.IEventCollision<Matter.Engine>)
          { me.processCollisionPairsEvent(MatterEvent.collisionEnd,event) } ); 
        
        Matter.Events.on(this.engine,MatterEvent.collisionEnd,
          function(event:Matter.IEventCollision<Matter.Engine>)
          { me.processCollisionPairsEvent(MatterEvent.collisionEnd,event) } ); 
              
        Matter.Events.on(this.engine,MatterEvent.beforeUpdate,
          function(event:Matter.IEventTimestamped<Matter.Engine>)
          { me.processTimestampedEvent(MatterEvent.collisionEnd,event) } ); 
    
        Matter.Events.on(this.engine,MatterEvent.afterUpdate,
          function(event:Matter.IEventComposite<Matter.Composite>)
          { me.processCompositeEvent(MatterEvent.afterUpdate,event) } ); 
      
        Matter.Events.on(this.engine,MatterEvent.beforeAdd,
          function(event:Matter.IEventComposite<Matter.Composite>)
          { me.processCompositeEvent(MatterEvent.beforeAdd,event) } ); 
    
        Matter.Events.on(this.engine,MatterEvent.afterAdd,
          function(event:Matter.IEventComposite<Matter.Composite>)
          { me.processCompositeEvent(MatterEvent.afterAdd,event) } ); 
      }

    public get engine(): Matter.Engine {
		return this._engine;
	}

	public set engine(value: Matter.Engine) {
		this._engine = value;
  }
  
	public get matterTools(): MatterTools  {
		return this._matterTools;
	}

	public set matterTools(value: MatterTools ) {
		this._matterTools = value;
	}


	public get mouseConstraint(): Matter.MouseConstraint {
		return this._mouseConstraint;
	}

	public set mouseConstraint(value: Matter.MouseConstraint) {
		this._mouseConstraint = value;
	}
  

	public get mouse(): Matter.Mouse {
		return this._mouse;
	}

	public set mouse(value: Matter.Mouse) {
		this._mouse = value;
	}
  

	public get collisionEventHandlers(): Map<string,MatterCollisionEvent> {
		return this._collisionEventHandlers;
	}

	public set collisionEventHandlers(value: Map<string,MatterCollisionEvent>) {
		this._collisionEventHandlers = value;
	}
  

	public get compositeEventHandlers(): Map<string,MatterCompositeEvent> {
		return this._compositeEventHandlers;
	}

	public set compositeEventHandlers(value: Map<string,MatterCompositeEvent>) {
		this._compositeEventHandlers = value;
	}
}