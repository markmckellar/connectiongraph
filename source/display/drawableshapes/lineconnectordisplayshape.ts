import { Drawable } from "../drawable";
import { WorldDisplay } from "../worlddisplay";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { DrawableConnector } from "./drawableconnector";
import { EngineConnector } from "../../engine/shapes/engineconnector";
import { EngineConnectorDef } from "../../engine/shapes/engineconnectordef";

export class LineConnectoDisplayShape implements DrawableConnector
{
	private _engineConnector:EngineConnector;
	Drawable
	constructor()
	{
		this.engineConnector = null;
		console.log("LineConnectoDisplayShape.constructor");

	}

	public init(engineConnector:EngineConnector,options:any):void {
		this.engineConnector = engineConnector;		
		console.log("LineConnectoDisplayShape.init");

	}


    /**
     * Getter engineConnector
     * @return {EngineConnector}
     */
	public get engineConnector(): EngineConnector {
		return this._engineConnector;
	}

    /**
     * Setter engineConnector
     * @param {EngineConnector} value
     */
	public set engineConnector(value: EngineConnector) {
		this._engineConnector = value;
	}
	
	
	
	
	public draw(context:CanvasRenderingContext2D):void
	{
		if(!this.engineConnector) throw Error("EngineConnector:engineConnector is not set, was init called?")
		//super.drawConnector(canvasHolder,node);
		/*
		super.drawNode(canvasHolder,node);

		*/
		//console.log("LineConnectoDisplayShape.drawShape");

		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");

		context.lineWidth = 2;
		
		this.engineConnector.setWorldPosition(
			WorldDisplay.getAveragePostionFromPositionList(
				EngineConnectorDef.getWorldPositionArrayFromEngineDefs(
					this.engineConnector.getEngineConnectorDefArray())			)

		);

		WorldDisplay.drawOutlinedShape(context,this.engineConnector.getShapePoints());
        

		WorldDisplay.drawConnectedLine(context,
			EngineConnectorDef.getWorldPositionArrayFromEngineDefs(
				this.engineConnector.getEngineConnectorDefArray())
		);

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
