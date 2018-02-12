import { WorldShape } from "../shapes/worldshape";
import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../worldobjectdisplay";

export class CircleDisplayShape extends WorldShape
{
	constructor(shapeName:string,radius:number,curvePoints:number,offsetFromOrigin:WorldPosition)
	{
		super(
			shapeName,			
			CircleDisplayShape.getCirclePositionList(radius,curvePoints),
			offsetFromOrigin
		);
		
	}

	public static getCirclePositionList(radius:number,curvePoints:number):Array<WorldPosition> {
		let pointList = new Array<WorldPosition>();
		
		let angleInc = 360 / curvePoints;
		for(let angle=0;angle<=360;angle=angle+angleInc)
		{
			let rads = angle * (Math.PI/180);
			pointList.push(
					new WorldPosition(
							radius*Math.cos(rads),
							radius*Math.sin(rads))
					);	
		}
		
		return(pointList);
	}
	
	
	
	public drawShape(worldObjectDisplay:WorldObjectDisplay,walkerWorld:WalkerWorld,context:CanvasRenderingContext2D):void
	{
		//super.drawConnector(canvasHolder,node);
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
	    
	    canvasHolder.context.beginPath();
	    canvasHolder.context.arc(node.position.getX(),node.position.getY(),this.displayInfo.radius,0,Math.PI * 2, false);
	    canvasHolder.context.closePath();
	    canvasHolder.context.fill();
	    canvasHolder.context.lineWidth = this.displayInfo.borderWidth;
		canvasHolder.context.stroke();
		*/
	}
}
