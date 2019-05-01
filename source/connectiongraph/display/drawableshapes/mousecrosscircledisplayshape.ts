import { WorldPosition } from "../../world/worldposition";
import { WorldDisplay } from "../worlddisplay";
import { CircleDisplayShape } from "./circledisplayshape";


export class MouseCrossCircleDisplayShape extends CircleDisplayShape
{

	constructor()
	{
		super();
	}

	public draw(context:CanvasRenderingContext2D):void
	{
		super.draw(context);
		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");
		let position:WorldPosition = this.circleEngineShape.getWorldPosition();
		
	    context.beginPath();
	    context.arc(position.x,position.y,this.circleEngineShape.getRadius(),0,Math.PI * 2, false);
	    
	    context.fill();
	    context.lineWidth = 1;
		context.stroke();


		context.beginPath();
		context.moveTo( this.circleEngineShape.getWorldPosition().x,0);
		context.lineTo(this.circleEngineShape.getWorldPosition().x,2000);	    
		context.closePath();
		context.stroke();
		
		context.beginPath();
		context.moveTo(0, this.circleEngineShape.getWorldPosition().y);
		context.lineTo(2000,this.circleEngineShape.getWorldPosition().y);	    
		context.closePath();
	    context.stroke();
	}
}
