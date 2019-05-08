import { Drawable } from "../drawable";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { DrawShapeWithBorderParams } from "../drawshapewithborderparams";
import { BasePolygonShapeWithBorder } from "./basepolygonsahewithborder";

export class RectangleDisplayShape extends BasePolygonShapeWithBorder implements Drawable
{
	private rectangleEngineShape:RectangleEngineShape;

	constructor(drawShapeWithBorderParams:DrawShapeWithBorderParams)
	{
		super(drawShapeWithBorderParams);
		this.rectangleEngineShape = null;
	}

	public init(rectangleEngineShape:RectangleEngineShape,options:any):void {
		this.rectangleEngineShape = rectangleEngineShape;		
	}
	
	public draw(context:CanvasRenderingContext2D):void
	{
		if(!this.rectangleEngineShape) throw Error("RectangleDisplayShape:rectangleEngineShape is not set, was init called?")
		this.drawOutlinedShape(this.rectangleEngineShape,context);
	

	}
}
