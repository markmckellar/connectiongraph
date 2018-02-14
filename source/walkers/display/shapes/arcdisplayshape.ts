import { WorldShape } from "../shapes/worldshape";
import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../worldobjectdisplay";

export class ArcDisplayShape extends WorldShape
{
	constructor(shapeName:string,endAngle:number,startAngle:number,radius:number,curvePoints:number,offsetFromOrigin:WorldPosition)
	{
		super(shapeName);		
	}

	
	public drawShape(worldObjectDisplay:WorldObjectDisplay,walkerWorld:WalkerWorld,context:CanvasRenderingContext2D,):void
	{
		/*
		super.drawNode(canvasHolder,node);

	    if(node.isSelected)
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(this.displayInfo.selectFillColor);
	    	canvasHolder.context.strokeStyle = Common.getColorFromString(this.displayInfo.selectBorderColor);
	    }
	    else
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(this.displayInfo.fillColor);
	    	canvasHolder.context.strokeStyle = Common.getColorFromString(this.displayInfo.borderColor);
	    }

	    canvasHolder.context.beginPath(); //Begins drawing the path. See link in "Edit" section
	    canvasHolder.context.moveTo(node.position.getX(),node.position.getY()); //Moves the beginning position to cx, cy (100, 75)
	    canvasHolder.context.arc(node.position.getX(),node.position.getY(),
	    		this.displayInfo.radius,
	    		this.toRadians(this.displayInfo.startAngle),
	    		this.toRadians(this.displayInfo.endAngle)); //	ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise (optional));
	    canvasHolder.context.lineTo(node.position.getX(),node.position.getY()); //Draws lines from the ends of the arc to cx and cy
	    canvasHolder.context.closePath(); //Finishes drawing the path
	    canvasHolder.context.fill(); //Actually draws the shape (and fills)
	    canvasHolder.context.lineWidth = this.displayInfo.borderWidth;
		canvasHolder.context.stroke();
		*/
	}
	//this.displayInfo.endAngle,this.displayInfo.startAngle
	public static toRadians(deg:number):number
	{
	    return deg * Math.PI / 180; //Converts degrees into radians
	}
}
