import { DrawShapeWithBorderParams } from "../drawshapewithborderparams";
import { WorldDisplay } from "../worlddisplay";
import { EngineShape } from "../../engine/shapes/engineshape";

export class BasePolygonShapeWithBorder {
    public drawShapeWithBorderParams:DrawShapeWithBorderParams;


    constructor(drawShapeWithBorderParams:DrawShapeWithBorderParams) {
        this.drawShapeWithBorderParams = drawShapeWithBorderParams;
    }

    public drawOutlinedShape(engineShape:EngineShape,context:CanvasRenderingContext2D):void
	{

		context.fillStyle = WorldDisplay.getColorFromString(this.drawShapeWithBorderParams.fillStyle);
		context.strokeStyle = WorldDisplay.getColorFromString(this.drawShapeWithBorderParams.strokeStyle);

        context.lineWidth = this.drawShapeWithBorderParams.lineWidth;
        
        WorldDisplay.drawOutlinedShape(context,engineShape.getShapePoints());

	

	}
}