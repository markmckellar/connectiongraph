import { MatterTools } from "./mattertools";
import { MatterEvent } from "./events/matterevent";
import { MatterCollisionEvent } from "./events/mattercollisionevent";
import { MatterCompositeEvent } from "./events/mattercompositeevent";
import { MatterTimestampedEvent } from "./events/mattertimestampedevent";
import { WorldEngine } from "../worldengine";
import { MatterEngine } from "./matterengine";
import * as Matter from "matter-js";

export class MatterEngineRender  extends MatterEngine {
  
    private _render : Matter.Render;  
    private _mouse:Matter.Mouse;
    private _mouseConstraint:Matter.MouseConstraint;
    
    
    public constructor() {
      super();
      this.render = Matter.Render.create({
        //let render = WalkerRenderer.create({
          element: document.body,
          engine: this.engine,
          options : {
            hasBounds:false,
            height:600,
            width:800,
            wireframes:false, 
          },
        }); 
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

    public get2DGraphicsContext():CanvasRenderingContext2D {
      return( this.render.context );
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

  public get render(): Matter.Render {
		return this._render;
	}

	public set render(value: Matter.Render) {
		this._render = value;
	}
}