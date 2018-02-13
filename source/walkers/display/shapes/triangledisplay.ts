import { WorldShape } from "../shapes/worldshape";
import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../worldobjectdisplay";


export class TriangleDisplay extends WorldShape
{
	constructor(shapeName:string,width:number,height:number,offsetFromOrigin: WorldPosition)
	{
		super(shapeName);
		
	}
	
	public drawShape(worldObjectDisplay:WorldObjectDisplay,walkerWorld:WalkerWorld,context:CanvasRenderingContext2D,):void
	{
		//super.drawNode(canvasHolder,node);
		//this.shape.drawShape(canvasHolder,node,this.displayInfo);
	}
}
