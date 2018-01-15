import { Walker } from "./walker";
import { Junction } from "./junction";
import { Destination } from "./destination";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { World } from "./world";

import * as Matter from "matter-js";



export class MatterEngine extends WalkerEngine {


	
    private _junctions : Map<string,Matter.Body>;
    private _destinations : Map<string,Matter.Body>;
    private _walkers : Map<string,Matter.Body>;
    private _paths : Map<string,Matter.Constraint>;
    private _walkerDestinations : Map<string,Matter.Constraint>;

    private _engine : Matter.Engine;

    public static boundsFilter:number = 0x0001;
    public static walkerFilter:number = 0x0002;
    public static junctionFilter:number = 0x0004;
    

    public constructor() {
        super();
        this.junctions = new Map<string,Matter.Body>();
        this.destinations = new Map<string,Matter.Body>();
        this.paths = new Map<string,Matter.Constraint>();    
        this.walkers = new Map<string,Matter.Body>(); 
        this.walkerDestinations = new Map<string,Matter.Constraint>();    
        
        //this.engine = engine; 
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;
    }

    public addPath(world:World,path:Path):void {
      console.log("MatterEngine.addPath:woldObjectId="+JSON.stringify(path.worldId.id));
      
      if(!this.paths.has(path.worldId.id))
      {
        if(this.paths.has(Path.getPathId(path.endJunction,path.startJunction).id))
        {
          this.paths.set(path.worldId.id,
            this.paths.get(Path.getPathId(path.endJunction,path.startJunction).id) );
        }
        else
        {
          console.log("MatterEngine.addPath:adding="+path.worldId.id);
        
          this.addJunction(world,path.startJunction);
          this.addJunction(world,path.endJunction);

          let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.worldId.id);
          let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.worldId.id);
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
          this.paths.set(path.worldId.id,matterPath);
        
          Matter.World.add(this.engine.world,[matterPath]);           
        } 
      }
    }

    public changeWalkerDestination(world:World,walker:Walker,destination:Destination):void{
      this.walkerDestinations.get(walker.worldId.id).bodyB = 
        this.junctions.get(walker.getCurrentJunction(world).worldId.id);
    }       
    
    public addWalker(world:World,walker:Walker):void { 
      if(!this.walkers.has(walker.worldId.id))
      {
        let junctionDensity = this.junctions.get(walker.getCurrentJunction(world).worldId.id).density;
        console.log("MatterEngine:addWalker:junctionDensity="+junctionDensity);

        let matterWalker = Matter.Bodies.circle(350,50,10,{density:junctionDensity/1000},8);
        matterWalker.collisionFilter.category = MatterEngine.walkerFilter;
        matterWalker.collisionFilter.mask = MatterEngine.walkerFilter|MatterEngine.boundsFilter;
        
        this.walkers.set(walker.worldId.id,matterWalker);
        Matter.World.add(this.engine.world,[matterWalker]); 
          
      

        let matterDestination = Matter.Constraint.create({
            bodyA: this.walkers.get(walker.worldId.id),
            bodyB: this.junctions.get(walker.getCurrentJunction(world).worldId.id),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
            stiffness:0.001,
          });
        this.walkerDestinations.set(walker.worldId.id,matterDestination);
      
        Matter.World.add(this.engine.world,[matterDestination]); 
      }
    }

    public addDestination(world:World,destination:Destination):void { 
      if(!this._destinations.has(destination.worldId.id))
      {
              let matterDestination = Matter.Bodies.circle(350,50,10,{},8);      
              this.destinations.set(destination.worldId.id,matterDestination);
              //Matter.World.add(this.engine.world,[matterWalker]);
              
      }
    }

    

    public addJunction(world:World,junction:Junction):void {
      if(!this.junctions.has(junction.worldId.id))
      {
              let matterJunction = Matter.Bodies.circle(350,50,40,{},8);      
              this.junctions.set(junction.worldId.id,matterJunction);
              Matter.World.add(this.engine.world,[matterJunction]);
              matterJunction.collisionFilter.category = MatterEngine.junctionFilter;
              matterJunction.collisionFilter.mask = MatterEngine.junctionFilter|MatterEngine.boundsFilter;
              
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

    private cloneVerticies(inVertices:Array<Matter.Vector>):Array<Matter.Vector>
    {
      let newVeritices:Array<Matter.Vector> = new Array<Matter.Vector>();
      
      for(let x=0;x<inVertices.length;x++)
      {
        let v:Matter.Vector = inVertices[x];
        newVeritices.push(Matter.Vector.create(v.x,v.y));
      }
      return(newVeritices);
    }

    public createBoundObject(body:Matter.Body,scaleInner:number,scaleOuter:number):Matter.Body {     
      let pointsInner:Array<Matter.Vector> = this.cloneVerticies(body.vertices);
      Matter.Vertices.scale(pointsInner,scaleInner,scaleInner,body.position);

      let pointsOuter:Array<Matter.Vector> = this.cloneVerticies(body.vertices);
      Matter.Vertices.scale(pointsOuter,scaleOuter,scaleOuter,body.position);
     
      let bodies:Array<Matter.Body> = new Array<Matter.Body>();
      
      // go all around the inner
      for(let i=0;i<pointsInner.length;i++)
      {
        let newVeritices:Array<Matter.Vector> = new Array<Matter.Vector>();
        let j = ((i+1)===pointsInner.length) ? 0 : (i+1);
        
        newVeritices.push(pointsInner[i]);
        newVeritices.push(pointsOuter[i]);
        newVeritices.push(pointsOuter[j]);
        newVeritices.push(pointsInner[j]);     
        //newVeritices.push(pointsInner[i]);
        
        let center:Matter.Vector = Matter.Vertices.centre(newVeritices);
        let newBody:Matter.Body = Matter.Bodies.fromVertices(center.x,center.y,[newVeritices],{});
         
        bodies.push(newBody);
      }

      let newBody:Matter.Body = Matter.Body.create({parts: bodies });        
      newBody.collisionFilter.category = MatterEngine.boundsFilter;
      newBody.restitution = 1.0; 
      return(newBody);
  }
    
    public createBounds(width:number,height:number):void {
        //let thickness = 10;
        //let width = render.canvas.width;
        //let height = render.canvas.height;
        /*
        let boundsBottom = Matter.Bodies.rectangle(width/2,height-thickness,width,thickness,{ isStatic: true });
        let boundsTop = Matter.Bodies.rectangle(width/2,0,width,thickness,{ isStatic: true });
        let boundsLeft = Matter.Bodies.rectangle(0,height/2,thickness,height, { isStatic: true });
        let boundsRight = Matter.Bodies.rectangle(width-thickness,height/2, thickness,height, { isStatic: true });

        boundsBottom.collisionFilter.category = MatterEngine.boundsFilter;
        boundsTop.collisionFilter.category = MatterEngine.boundsFilter;
        boundsLeft.collisionFilter.category = MatterEngine.boundsFilter;
        boundsRight.collisionFilter.category = MatterEngine.boundsFilter;
        

        
        //boxA.restitution = 1.0;
        //boxB.restitution = 1.0;
        boundsBottom.restitution = 1.0;
        boundsTop.restitution = 1.0;
        boundsLeft.restitution = 1.0;
        boundsRight.restitution = 1.0;
        Matter.World.add(this.engine.world, [boundsBottom,boundsTop,boundsLeft,boundsRight]);
   */
      let wallBoundsRect = Matter.Bodies.rectangle(width/2,height/2,width,height,{});
      let walls:Matter.Body = this.createBoundObject(wallBoundsRect,1,10);
      walls.collisionFilter.category = MatterEngine.boundsFilter;
      walls.restitution = 1.0;
      Matter.Body.setStatic(walls,true);
      Matter.World.add(this.engine.world, [walls]);
      
      
  
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
  

	public get destinations(): Map<string,Matter.Body> {
		return this._destinations;
	}

	public set destinations(value: Map<string,Matter.Body>) {
		this._destinations = value;
	}
  
    
    public get engine(): Matter.Engine {
		return this._engine;
	}

	public set engine(value: Matter.Engine) {
		this._engine = value;
  }
  

	public get walkerDestinations(): Map<string,Matter.Constraint> {
		return this._walkerDestinations;
	}

	public set walkerDestinations(value: Map<string,Matter.Constraint>) {
		this._walkerDestinations = value;
	}

  
    
}