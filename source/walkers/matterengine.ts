import { Walker } from "./walker";
import { Junction } from "./junction";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { World } from "./world";
import * as Matter from "matter-js";



export class MatterEngine extends WalkerEngine {


	
    private _junctions : Map<string,Matter.Body>;
    private _walkers : Map<string,Matter.Body>;
    private _paths : Map<string,Matter.Constraint>;

    private _engine : Matter.Engine;
    

    public constructor() {
        super();
        this.junctions = new Map<string,Matter.Body>();
        this.paths = new Map<string,Matter.Constraint>();    
        //this.engine = engine; 
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;
    }

    public addPath(world:World,path:Path):void {
      console.log("MatterEngine.addPath:woldObjectId="+JSON.stringify(path.woldObjectId));
      
      if(!this.paths.has(path.woldObjectId))
      {
              this.addJunction(world,path.startJunction);
              this.addJunction(world,path.endJunction);

              let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.woldObjectId);
              let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.woldObjectId);
              //console.log("MatterEngine.addPath:matterStartJunction="+JSON.stringify(matterStartJunction));
              //console.log("MatterEngine.addPath:matterEndJunction="+JSON.stringify(matterEndJunction));
              
              let matterPath = Matter.Constraint.create({
                  bodyA: matterStartJunction,
                  bodyB: matterEndJunction,  
                  pointA: { x: -0, y: -0 },
                  pointB: { x: -0, y: -0 },
                  stiffness:0.0001,
                });
              this.paths.set(path.woldObjectId,matterPath);

              Matter.World.add(this.engine.world,[matterPath]);            
      }
    }

    public addWalker(world:World,walker:Walker):void { 
    }

    public addJunction(world:World,junction:Junction):void {
      if(!this.junctions.has(junction.woldObjectId))
      {
              let matterJunction = Matter.Bodies.circle(350,50,40,{},8);      
              this.junctions.set(junction.woldObjectId,matterJunction);
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

    public get junctions(): Map<string,Matter.Body> {
		return this._junctions;
	}

	public set junctions(value: Map<string,Matter.Body>) {
		this._junctions = value;
    }
    
    public get paths(): Map<string,Matter.Constraint> {
		return this._paths;
	}

	public set paths(value: Map<string,Matter.Constraint>) {
		this._paths = value;
    }

    public get walkers(): Map<string,Matter.Body> {
		return this._walkers;
	}

	public set walkers(value: Map<string,Matter.Body>) {
		this._walkers = value;
	}
    
    public get engine(): Matter.Engine {
		return this._engine;
	}

	public set engine(value: Matter.Engine) {
		this._engine = value;
	}
    
}