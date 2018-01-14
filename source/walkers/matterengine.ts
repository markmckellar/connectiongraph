import { Walker } from "./walker";
import { Junction } from "./junction";
import { Destination } from "./destination";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { World } from "./world";
import { WorldId } from "./worldid";

import * as Matter from "matter-js";



export class MatterEngine extends WalkerEngine {


	
    private _junctions : Map<WorldId,Matter.Body>;
    private _destinations : Map<WorldId,Matter.Body>;
    private _walkers : Map<WorldId,Matter.Body>;
    private _paths : Map<WorldId,Matter.Constraint>;

    private _engine : Matter.Engine;
    

    public constructor() {
        super();
        this.junctions = new Map<WorldId,Matter.Body>();
        this.destinations = new Map<WorldId,Matter.Body>();
        this.paths = new Map<WorldId,Matter.Constraint>();    
        this.walkers = new Map<WorldId,Matter.Body>();    
        
        //this.engine = engine; 
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;
    }

    public addPath(world:World,path:Path):void {
      console.log("MatterEngine.addPath:woldObjectId="+JSON.stringify(path.worldId.id));
      
      if(!this.paths.has(path.worldId))
      {
              this.addJunction(world,path.startJunction);
              this.addJunction(world,path.endJunction);

              let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.worldId);
              let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.worldId);
              //console.log("MatterEngine.addPath:matterStartJunction="+JSON.stringify(matterStartJunction));
              //console.log("MatterEngine.addPath:matterEndJunction="+JSON.stringify(matterEndJunction));
              
              let matterPath = Matter.Constraint.create({
                  bodyA: matterStartJunction,
                  bodyB: matterEndJunction,  
                  pointA: { x: -0, y: -0 },
                  pointB: { x: -0, y: -0 },
                  length:150,
                  stiffness:0.0001,
                });
              this.paths.set(path.worldId,matterPath);

              Matter.World.add(this.engine.world,[matterPath]);            
      }
    }

    public addDestination(world:World,destination:Destination):void { 
      if(!this._destinations.has(destination.worldId))
      {
              let matterDestination = Matter.Bodies.circle(350,50,10,{},8);      
              this.walkers.set(destination.worldId,matterDestination);
              //Matter.World.add(this.engine.world,[matterWalker]);
              
      }
    }

    public addWalker(world:World,walker:Walker):void { 
      if(!this.walkers.has(walker.worldId))
      {
              let matterWalker = Matter.Bodies.circle(350,50,10,{},8);      
              this.walkers.set(walker.worldId,matterWalker);
              Matter.World.add(this.engine.world,[matterWalker]);
              
      }
    }

    public addJunction(world:World,junction:Junction):void {
      if(!this.junctions.has(junction.worldId))
      {
              let matterJunction = Matter.Bodies.circle(350,50,40,{},8);      
              this.junctions.set(junction.worldId,matterJunction);
              Matter.World.add(this.engine.world,[matterJunction]);
              
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
    
    public createBounds(width:number,height:number):void {
        let thickness = 10;
        //let width = render.canvas.width;
        //let height = render.canvas.height;
        let boundsBottom = Matter.Bodies.rectangle(width/2,height-thickness,width,thickness,{ isStatic: true });
        let boundsTop = Matter.Bodies.rectangle(width/2,0,width,thickness,{ isStatic: true });
        let boundsLeft = Matter.Bodies.rectangle(0,height/2,thickness,height, { isStatic: true });
        let boundsRight = Matter.Bodies.rectangle(width-thickness,height/2, thickness,height, { isStatic: true });
        
        //boxA.restitution = 1.0;
        //boxB.restitution = 1.0;
        boundsBottom.restitution = 1.0;
        boundsTop.restitution = 1.0;
        boundsLeft.restitution = 1.0;
        boundsRight.restitution = 1.0;
        Matter.World.add(this.engine.world, [boundsBottom,boundsTop,boundsLeft,boundsRight]);
   
    }

    public get junctions(): Map<WorldId,Matter.Body> {
		return this._junctions;
	}

	public set junctions(value: Map<WorldId,Matter.Body>) {
		this._junctions = value;
    }
    
    public get paths(): Map<WorldId,Matter.Constraint> {
		return this._paths;
	}

	public set paths(value: Map<WorldId,Matter.Constraint>) {
		this._paths = value;
    }

    public get walkers(): Map<WorldId,Matter.Body> {
		return this._walkers;
	}

	public set walkers(value: Map<WorldId,Matter.Body>) {
		this._walkers = value;
  }
  

	public get destinations(): Map<WorldId,Matter.Body> {
		return this._destinations;
	}

	public set destinations(value: Map<WorldId,Matter.Body>) {
		this._destinations = value;
	}
  
    
    public get engine(): Matter.Engine {
		return this._engine;
	}

	public set engine(value: Matter.Engine) {
		this._engine = value;
	}
    
}