import { WorldDisplay } from "../worlddisplay";
import { DrawableConnector } from "./drawableconnector";
import { EngineConnector } from "../../engine/connectors/engineconnector";


export class LineConnectorDisplay implements DrawableConnector
{
    private _engineConnector:EngineConnector;


	constructor()
	{
		this.engineConnector = null;
	}

	public init(engineConnector:EngineConnector,options:any):void {
		this.engineConnector = engineConnector;	
	}

	
	public draw(context:CanvasRenderingContext2D):void
	{
        context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");


        context.lineWidth = 2;
        for(let i=0;i<this.engineConnector.getEngineConnectorDefArray().length;i++)
        {
			WorldDisplay.drawConnectedLine(context,
			[
                this.engineConnector.getEngineConnectorDefArray()[i].engineShape.getWorldPosition(),
                this.engineConnector.getWorldPosition()
            ]);
        }

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

	
}








