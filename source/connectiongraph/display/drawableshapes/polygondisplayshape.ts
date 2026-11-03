import { GraphTheme } from "../theme";
import { DrawShapeWithBorderParams } from "../drawshapewithborderparams";
import { Drawable } from "../drawable";
import { PolygonEngineShape } from "../../engine/shapes/polygonengineshape";
import { WorldDisplay } from "../worlddisplay";

export class PolygonDisplayShape implements Drawable
{
	private _polygonEngineShape!:PolygonEngineShape;

	constructor(private style:DrawShapeWithBorderParams = GraphTheme.node)
	{
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

		context.fillStyle = WorldDisplay.getColorFromString(this.style.fillStyle);
		context.strokeStyle = WorldDisplay.getColorFromString(this.style.strokeStyle);
        context.lineWidth = this.style.lineWidth;
        
        WorldDisplay.drawOutlinedShape(context,this.polygonEngineShape.getPolygonPoints());
		
	}
}
