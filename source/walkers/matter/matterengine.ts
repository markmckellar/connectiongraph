import { Walker } from "../walker";
import { Junction } from "../junction";
import { Destination } from "../destination";
import { Path } from "../path";
import { WalkerEngine } from "../walkerengine";
import { World } from "../world";
import { MatterJunction } from "./matterjunction";
import { MatterDestination } from "./matterdestination";
import { MatterWalker } from "./matterwalker";
import * as Matter from "matter-js";



export class MatterEngine extends WalkerEngine {


	
    private _junctions : Map<string,MatterJunction>;
    private _destinations : Map<string,MatterDestination>;
    private _walkers : Map<string,MatterWalker>;
    private _paths : Map<string,Matter.Constraint>;
    //private _walkerDestinations : Map<string,Matter.Constraint>;

    private _engine : Matter.Engine;

    public static boundsFilter:number = 1;//0x0001;
    public static walkerFilter:number = 2;
    public static junctionSpacerFilter:number = 4;
    public static junctionFilter:number = 8;
    public static boundryContainerFilter:number = 16;
    public static boundrySpatialFilter:number = 32;
    
    

    public constructor() {
        super();
        this.junctions = new Map<string,MatterJunction>();
        this.destinations = new Map<string,MatterDestination>();
        this.paths = new Map<string,Matter.Constraint>();    
        this.walkers = new Map<string,MatterWalker>(); 
        //this.walkerDestinations = new Map<string,Matter.Constraint>();    
        
        //this.engine = engine; 
        this.engine = Matter.Engine.create(); 
        
        this.engine.world.gravity.x = 0.0;
        this.engine.world.gravity.y = 0.0;
    }

    public addPath(world:World,path:Path):void {
      //console.log("MatterEngine.addPath:woldObjectId="+JSON.stringify(path.worldId.id));
      
      if(!this.paths.has(path.worldId.id))
      {
        if(this.paths.has(Path.getPathId(path.endJunction,path.startJunction).id))
        {
          this.paths.set(path.worldId.id,
            this.paths.get(Path.getPathId(path.endJunction,path.startJunction).id) );
        }
        else
        {
         // console.log("MatterEngine.addPath:adding="+path.worldId.id);
        
          this.addJunction(world,path.startJunction);
          this.addJunction(world,path.endJunction);

          let matterStartJunction:Matter.Body = this.junctions.get(path.startJunction.worldId.id).getAreaJunction();
          let matterEndJunction:Matter.Body = this.junctions.get(path.endJunction.worldId.id).getAreaJunction();
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
      this.walkers.get(walker.worldId.id).getWalker2DestinationSpring().bodyB = 
        this.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction();
    }       
    
    public addWalker(world:World,walker:Walker):void { 
      if(!this.walkers.has(walker.worldId.id))
      {
        //let junctionDensity = this.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction().density;
        //console.log("MatterEngine:addWalker:junctionDensity="+junctionDensity);

        //let matterWalker = Matter.Bodies.circle(350,50,10,{density:junctionDensity/1000},8);
        //matterWalker.collisionFilter.category = MatterEngine.walkerFilter;
        //matterWalker.collisionFilter.mask = MatterEngine.walkerFilter|MatterEngine.boundsFilter;
        
        let matterWalker:MatterWalker = new MatterWalker(world,this,walker);
        this.walkers.set(walker.worldId.id,matterWalker);
        matterWalker.addToEngine(world,this);
        //Matter.World.add(this.engine.world,[matterWalker]); 
          /*
      

        let matterDestination = Matter.Constraint.create({
            bodyA: this.walkers.get(walker.worldId.id),
            bodyB: this.junctions.get(walker.getCurrentJunction(world).worldId.id).getAreaJunction(),  
            pointA: { x: -0, y: -0 },
            pointB: { x: -0, y: -0 },
            length:0,
            stiffness:0.001,
          });
        this.walkerDestinations.set(walker.worldId.id,matterDestination);
      
        Matter.World.add(this.engine.world,[matterDestination]);
        */ 
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
      let wallBoundsRect = Matter.Bodies.rectangle(width/2,height/2,width,height,{});
      let walls:Matter.Body = this.createBoundObject(wallBoundsRect,1,10);
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
  /*

	public get walkerDestinations(): Map<string,Matter.Constraint> {
		return this._walkerDestinations;
	}

	public set walkerDestinations(value: Map<string,Matter.Constraint>) {
		this._walkerDestinations = value;
	}
*/
  
    
}