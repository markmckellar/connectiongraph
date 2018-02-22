import { Drawable } from "../drawable";
import { WorldPosition } from "../../world/worldposition";
//import { WalkerWorld } from "../../walkers/walkerworld/walkerworld";
import { WorldDisplay } from "../worlddisplay";
import { CircleEngineShape } from "../../engine/shapes/circleengineshape";
//import { WalkerEngine } from "../../walkerworld/walkerengine";


export class CircleDisplayShape implements Drawable
{
	private _circleEngineShape:CircleEngineShape;

	constructor()
	{
		this.circleEngineShape = null;
	}

	public init(circleEngineShape:CircleEngineShape,options:any):void {
		this.circleEngineShape = circleEngineShape;		
	}
	

	public get circleEngineShape(): CircleEngineShape {
		return this._circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this._circleEngineShape = value;
	}
	
	
	public draw(context:CanvasRenderingContext2D):void
	{
		//super.drawConnector(canvasHolder,node);
		/*
		super.drawNode(canvasHolder,node);

		*/
		//console.log("CircleDisplayShape.drawShape");

		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");
		let position:WorldPosition = this.circleEngineShape.getWorldPosition();
		
	    context.beginPath();
	    context.arc(position.x,position.y,this.circleEngineShape.getRadius(),0,Math.PI * 2, false);
	    context.closePath();
	    context.fill();
	    context.lineWidth = 2;
		context.stroke();
	}
}
