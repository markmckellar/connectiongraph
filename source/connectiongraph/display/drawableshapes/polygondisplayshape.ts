import { Drawable } from "../drawable";
import { PolygonEngineShape } from "../../engine/shapes/polygonengineshape";
import { WorldDisplay } from "../worlddisplay";

export class PolygonDisplayShape implements Drawable
{
	private _polygonEngineShape:PolygonEngineShape;

	constructor()
	{
		this.polygonEngineShape = null;
	}

	public init(polygonEngineShape:PolygonEngineShape,options:any):void {
		this.polygonEngineShape = polygonEngineShape;		
	}

	public get polygonEngineShape(): PolygonEngineShape {
		return this._polygonEngineShape;
	}

	public set polygonEngineShape(value: PolygonEngineShape) {
		this._polygonEngineShape = value;
	}

	
	
	public draw(context:CanvasRenderingContext2D):void
	{
		if(!this.polygonEngineShape) throw Error("PolygonDisplayShape:PolygonEngineShape is not set, was init called?")

		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");
        context.lineWidth = 2;
        
        WorldDisplay.drawOutlinedShape(context,this.polygonEngineShape.getPolygonPoints());
		
	}
}
