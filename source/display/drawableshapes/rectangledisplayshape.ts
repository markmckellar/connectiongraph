import { Drawable } from "../drawable";
import { WorldDisplay } from "../worlddisplay";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";

export class RectangleDisplayShape implements Drawable
{
	private _rectangleEngineShape:RectangleEngineShape;

	constructor()
	{
		this.rectangleEngineShape = null;
	}

	public init(rectangleEngineShape:RectangleEngineShape,options:any):void {
		this.rectangleEngineShape = rectangleEngineShape;		
	}

	public get rectangleEngineShape(): RectangleEngineShape {
		return this._rectangleEngineShape;
	}

	public set rectangleEngineShape(value: RectangleEngineShape) {
		this._rectangleEngineShape = value;
	}
	
	
	
	public draw(context:CanvasRenderingContext2D):void
	{
		if(!this.rectangleEngineShape) throw Error("RectangleDisplayShape:rectangleEngineShape is not set, was init called?")
		//super.drawConnector(canvasHolder,node);
		/*
		super.drawNode(canvasHolder,node);

		*/
		//console.log("CircleDisplayShape.drawShape");

		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");

        context.lineWidth = 2;
        
        WorldDisplay.drawOutlinedShape(context,this.rectangleEngineShape.getShapePoints());

		/*

		let position:WorldPosition = this.rectangleEngineShape.getWorldPosition();


		context.fillRect( 
			(position.x-this.rectangleEngineShape.getWidth()/2),
			(position.y-this.rectangleEngineShape.getHeight()/2),
			this.rectangleEngineShape.getWidth(),
			this.rectangleEngineShape.getHeight());
			context.lineWidth = 2;
		context.strokeRect( 
			(position.x-this.rectangleEngineShape.getWidth()/2), 
			(position.y-this.rectangleEngineShape.getHeight()/2), 
			this.rectangleEngineShape.getWidth(), 
			this.rectangleEngineShape.getHeight());
		*/

	}
}
