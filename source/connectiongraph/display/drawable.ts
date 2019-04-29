import { EngineShape } from "../engine/shapes/engineshape";

//import { WorldShape } from "./shapes/worldshape";
//import { WorldObject } from "../world/worldobject";
//import { WalkerWorld } from "../walkers/walkerworld/walkerworld";
//import { WorldPosition } from "../world/worldposition";


export interface Drawable {
	//private _shapes:Map<string,WorldShape>;
	//private _position:WorldPosition;
	
    
    //constructor(position:WorldPosition) {


	draw(context:CanvasRenderingContext2D):void;
	init(engineShape:EngineShape,options:any):void;
	

	/*
	drawShape(canvasHolder,node,displayInfo)
	{
	    if(node.isSelected)
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(displayInfo.selectFillColor);
	    	canvasHolder.context.strokeStyle = Common.getColorFromString(displayInfo.selectBorderColor);
	    }
	    else
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(displayInfo.fillColor);
	    	canvasHolder.context.strokeStyle = Common.getColorFromString(displayInfo.borderColor);
	    }
	    
	    canvasHolder.context.beginPath();
	    for(var i=0;i<this.pointList.length;i++)
	    {   	
			var point = this.pointList[i].createByAdding(node.position);
	    	if(i==0) canvasHolder.context.moveTo(point.getX(),point.getY());
	    	else canvasHolder.context.lineTo(point.getX(),point.getY());
	    }
	    canvasHolder.context.closePath();
	    
	    canvasHolder.context.fill();
	    canvasHolder.context.lineWidth = displayInfo.borderWidth;
	    canvasHolder.context.stroke();
	    
	    if(this.drawCenterDot)
	    {
	    	var averageTrans = this.getAveragePointTransformed(node);
	    	canvasHolder.context.fillStyle = Common.getColorFromString("000000ff");
	    	canvasHolder.context.beginPath();
	    	canvasHolder.context.arc(node.position.getX(),node.position.getY(),2,0,Math.PI * 2, false);
	    	canvasHolder.context.closePath();
	    	canvasHolder.context.fill();
		}
	}
	*/

	
	/*
	public getShape(worldObject:WorldObject,shapeName:string):WorldShape {

		if(!this.shapes.has(shapeName)) { throw new Error(
			worldObject.worldId.id+" is missing shape:"+shapeName);
		}
		
		return(this.shapes.get(shapeName));
		
	}
	*/

	/*
	public get shapes(): Map<string,WorldShape> {
		return this._shapes;
	}
	
	public set shapes(value: Map<string,WorldShape>) {
		this._shapes = value;
	}
*/

	
};