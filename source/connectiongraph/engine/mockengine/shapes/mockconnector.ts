import { WorldPosition } from "../../../world/worldposition";
import { WorldId } from "../../../world/worldid";
import { EngineConnector } from "../../connectors/engineconnector";
import { DrawableConnector } from "../../../display/drawableshapes/drawableconnector";
import { EngineConnectorDef } from "../../connectors/engineconnectordef";
import { EngineShape } from "../../shapes/engineshape";
import { MockShape } from "./mockshape";
import { MockEngine } from "../mockengine";
import { MockConnectorDef } from "./mockconnectordef";

export class MockConnector extends MockShape implements EngineConnector
{
    private _drawableConnector:DrawableConnector;
    private _mockConnectorDefArray:Array<MockConnectorDef>;
	private _connectorShape:EngineShape;

    constructor(
        worldId:WorldId,
        drawableConnector:DrawableConnector,
        connectorShape:EngineShape,
        mockConnectorDefArray:Array<MockConnectorDef>,
        options:any,
        mockEngine:MockEngine)
	{
       super(worldId,drawableConnector,connectorShape.getWorldPosition(),options);
       this.drawableConnector = drawableConnector;
       this.mockConnectorDefArray = mockConnectorDefArray;

       
       this.connectorShape = connectorShape;

       connectorShape.getDrawable().init(connectorShape,options);

       this.setSelectable(false);
        
       drawableConnector.init(this,options);
       this.setSelectable(false);

    }


    public getShapePoints():Array<WorldPosition> {
        return( this.connectorShape.getShapePoints());
    }


    /**
     * Getter mockConnectorDefArray
     * @return {Array<MockConnectorDef>}
     */
	public get mockConnectorDefArray(): Array<MockConnectorDef> {
		return this._mockConnectorDefArray;
	}

    /**
     * Setter mockConnectorDefArray
     * @param {Array<MockConnectorDef>} value
     */
	public set mockConnectorDefArray(value: Array<MockConnectorDef>) {
		this._mockConnectorDefArray = value;
	}


    public getEngineConnectorDefArray():Array<EngineConnectorDef> {
        return(this.mockConnectorDefArray);
    }

/*
    public getMiddleWorldPosition():WorldPosition {
        let positions = new Array<WorldPosition>();
        for(let i=0;i<this.mockConnectorDefArray.length;i++) positions.push(this.mockConnectorDefArray[i].engineShape.getWorldPosition());
        let middle:WorldPosition = WorldDisplay.getAveragePostionFromPositionList(positions);
        return(middle);
    }
*/

    /**
     * Getter connectorShape
     * @return {EngineShape}
     */
	public get connectorShape(): EngineShape {
		return this._connectorShape;
	}

    /**
     * Setter connectorShape
     * @param {EngineShape} value
     */
	public set connectorShape(value: EngineShape) {
		this._connectorShape = value;
	}


    public containsWorldPosition(worldPosition:WorldPosition):boolean {
        return(this.connectorShape.containsWorldPosition(worldPosition));
        //return(false);
    }

    /*
    public isSelected(): boolean { return(this.connectorShape.isSelected()); }

    
    public getWorldPosition():WorldPosition {
        //return(this.getMiddleWorldPosition());
        //return(super.getWorldPosition());
        return(this.connectorShape.getWorldPosition());

    }

	public translate(worldPosition:WorldPosition):void {
        this.connectorShape.translate(worldPosition);
    }

	public setWorldPosition(worldPosition:WorldPosition):void {
        this.connectorShape.setWorldPosition(worldPosition);
    }
    */
/*
    public containsWorldPosition(worldPosition:WorldPosition):boolean {
        return(false);
    }

	public getDrawable():Drawable {
        return(this.drawableConnector);
     }

*/



    /**
     * Getter drawableConnector
     * @return {DrawableConnector}
     */
	public get drawableConnector(): DrawableConnector {
		return this._drawableConnector;
	}

    /**
     * Setter drawableConnector
     * @param {DrawableConnector} value
     */
	public set drawableConnector(value: DrawableConnector) {
		this._drawableConnector = value;
	}


    /**
     * Getter connectorCircleBody
     * @return {Matter.Body}
     *
	public get connectorCircleBody(): MockCircle {
		return this._connectorCircleBody;
	}

    /**
     * Setter connectorCircleBody
     * @param {Matter.Body} value
     *
	public set connectorCircleBody(value: MockCircle) {
		this._connectorCircleBody = value;
	}
*/

    

}
