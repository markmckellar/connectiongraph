import { WorldPosition } from "../../../world/worldposition";
import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class MatterRectangle extends MatterShape implements RectangleEngineShape
{
	private _rectangleBody:Matter.Body;
	private _width:number;
	private _height:number;
	

	constructor(worldId:WorldId,drawable:Drawable,width:number,height:number,position:WorldPosition,options:any,matterEngine:MatterEngine)
	{
		super(worldId,drawable,options,matterEngine);
		//super(shapeName,radius);
		this.width = width;
		this.height = height;	
        this.rectangleBody = Matter.Bodies.rectangle(
            position.x,position.y,
			this.width,
			this.height,
            options);	
		this.rectangleBody.collisionFilter.category = MatterEngine.boundsFilter;
		drawable.init(this,options);
		Matter.World.add(matterEngine.engine.world,[this.rectangleBody]);
		
		
	}


	public getWidth():number {
		return(this.width);
	}
	public getHeight():number {
		return(this.height);
	}
    public getBody():Matter.Body {
		return(this.rectangleBody);
	}


	public get rectangleBody(): Matter.Body {
		return this._rectangleBody;
	}

	public set rectangleBody(value: Matter.Body) {
		this._rectangleBody = value;
	}

	public get width(): number {
		return this._width;
	}

	public set width(value: number) {
		this._width = value;
	}

	public get height(): number {
		return this._height;
	}

	public set height(value: number) {
		this._height = value;
	}



}
