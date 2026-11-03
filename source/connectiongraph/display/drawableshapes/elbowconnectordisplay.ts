import { WorldDisplay } from "../worlddisplay";
import { DrawableConnector } from "./drawableconnector";
import { EngineConnector } from "../../engine/connectors/engineconnector";
import { BoundingBox } from "../../engine/shapes/boundingbox";

/**
 * Pedigree-style connector: straight down from the bottom edge of each parent
 * shape, across at the halfway height, then down into the top edge of the
 * child shape.
 */
export class ElbowConnectorDisplay implements DrawableConnector
{
	private engineConnector!:EngineConnector;

	constructor(private strokeStyle:string = "37474fff", private lineWidth:number = 2)
	{
	}

	public init(engineConnector:EngineConnector,options:any):void {
		this.engineConnector = engineConnector;
	}

	public draw(context:CanvasRenderingContext2D):void
	{
		const child = new BoundingBox(this.engineConnector.getShapePoints());
		const childX = child.position.x + child.width/2;
		const childTop = child.position.y;

		context.strokeStyle = WorldDisplay.getColorFromString(this.strokeStyle);
		context.lineWidth = this.lineWidth;
		context.lineJoin = "round";

		for(const def of this.engineConnector.getEngineConnectorDefArray()) {
			const parent = new BoundingBox(def.engineShape.getShapePoints());
			const parentX = parent.position.x + parent.width/2;
			const parentBottom = parent.position.y + parent.height;
			const midY = (parentBottom + childTop)/2;

			context.beginPath();
			context.moveTo(parentX,parentBottom);
			context.lineTo(parentX,midY);
			context.lineTo(childX,midY);
			context.lineTo(childX,childTop);
			context.stroke();
		}
	}
}
