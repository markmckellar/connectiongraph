import { WorldShape } from "../shapes/worldshape";
import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../worldobjectdisplay";
import { CircleEngineShape } from "../../engine/shapes/circleengineshape";
import { WalkerEngine } from "../../walkerworld/walkerengine";


export class CircleDisplayShape extends WorldShape
{
	private _circleEngineShape:CircleEngineShape;

	constructor(shapeName:string,radius:number,worldPosition:WorldPosition,walkerEngine:WalkerEngine)
	{
		super(shapeName);
		this.circleEngineShape = walkerEngine.getNewCircleEngineShape(shapeName,radius,worldPosition);
	}

	public get circleEngineShape(): CircleEngineShape {
		return this._circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this._circleEngineShape = value;
	}
	
	
	public drawShape(worldObjectDisplay:WorldObjectDisplay,walkerWorld:WalkerWorld,context:CanvasRenderingContext2D):void
	{
		//super.drawConnector(canvasHolder,node);
		/*
		super.drawNode(canvasHolder,node);

		*/
		context.fillStyle = WorldObjectDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldObjectDisplay.getColorFromString("0000ffff");
		let position:WorldPosition = this.circleEngineShape.getWorldPosition();
		
	    context.beginPath();
	    context.arc(position.x,position.y,this.circleEngineShape.radius,0,Math.PI * 2, false);
	    context.closePath();
	    context.fill();
	    context.lineWidth = 2;
		context.stroke();
	}
}
