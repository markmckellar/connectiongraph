import { GraphTheme } from "../theme";
import { WorldDisplay } from "../worlddisplay";
import { CircleDisplayShape } from "./circledisplayshape";


export class MouseCrossCircleDisplayShape extends CircleDisplayShape
{

	constructor()
	{
		super();
	}

	/** A small ring with short cross-hairs where the engine thinks the mouse is. */
	public draw(context:CanvasRenderingContext2D):void
	{
		const {x,y} = this.circleEngineShape.getWorldPosition();
		const r = this.circleEngineShape.getRadius();
		context.save();
		context.strokeStyle = WorldDisplay.getColorFromString(GraphTheme.cursor);
		context.lineWidth = 1.5;
		context.beginPath();
		context.arc(x,y,r,0,Math.PI*2);
		context.moveTo(x-r-5,y); context.lineTo(x-r+1,y);
		context.moveTo(x+r-1,y); context.lineTo(x+r+5,y);
		context.moveTo(x,y-r-5); context.lineTo(x,y-r+1);
		context.moveTo(x,y+r-1); context.lineTo(x,y+r+5);
		context.stroke();
		context.restore();
	}
}
