import { WorldPosition } from "../../../world/worldposition";
import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { EngineConnector } from "../../shapes/engineconnector";
import { DrawableConnector } from "../../../display/drawableshapes/drawableconnector";
import { EngineConnectorDef } from "../../shapes/engineconnectordef";
import { WorldDisplay } from "../../../display/worlddisplay";
import { EngineShape } from "../../shapes/engineshape";

export class MatterConnector extends MatterShape implements EngineConnector
{
    private _drawableConnector:DrawableConnector;
    private _engineConnectorDefArray:Array<EngineConnectorDef>;

    private _connectorCircleBody:Matter.Body;
	private _connectorCircleCurvePoints:number;
	private _connectorCircleRadius:number;
	
    constructor(
        worldId:WorldId,
        drawableConnector:DrawableConnector,
        connectorShape:EngineShape,
        engineConnectorDefArray:Array<EngineConnectorDef>,
        position:WorldPosition,
        options:any,
        matterEngine:MatterEngine)
	{
       super(worldId,drawableConnector,options,matterEngine);
       this.drawableConnector = drawableConnector;
       this.engineConnectorDefArray = engineConnectorDefArray;



       this.connectorCircleRadius = 1; // REALLY?!?! it should be a param
       this.connectorCircleCurvePoints = 8; // REALLY?!?! it should be a param
       this.connectorCircleBody = Matter.Bodies.circle(
           position.x,position.y,
           this.connectorCircleRadius,
           options,
           this.connectorCircleCurvePoints);	
       //this.circleBody.collisionFilter.category = MatterEngine.boundsFilter;
       matterEngine.addMatterShape(this);

        
       drawableConnector.init(this,options);
       matterEngine.addMatterShape(this);
    }

    public getBody():Matter.Body {
        return(this.connectorCircleBody);
    }

    public getEngineConnectorDefArray():Array<EngineConnectorDef> {
        return(this.engineConnectorDefArray);
    }


    public getMiddleWorldPosition():WorldPosition {
        let positions = new Array<WorldPosition>();
        for(let i=0;i<this.engineConnectorDefArray.length;i++) positions.push(this.engineConnectorDefArray[i].engineShape.getWorldPosition());
        let middle:WorldPosition = WorldDisplay.getAveragePostionFromPositionList(positions);
        return(middle);
    }

    public getWorldPosition():WorldPosition {
        return(this.getMiddleWorldPosition());
    }

	public translate(worldPosition:WorldPosition):void {
    }

	public setWorldPosition(worldPosition:WorldPosition):void {
    }

    public containsWorldPosition(worldPosition:WorldPosition):boolean {
        return(false);
    }

	public getDrawable():Drawable {
        return(this.drawableConnector);
     }


    /**
     * Getter engineConnectorDefArray
     * @return {Array<EngineConnectorDef>}
     */
	public get engineConnectorDefArray(): Array<EngineConnectorDef> {
		return this._engineConnectorDefArray;
	}

    /**
     * Setter engineConnectorDefArray
     * @param {Array<EngineConnectorDef>} value
     */
	public set engineConnectorDefArray(value: Array<EngineConnectorDef>) {
		this._engineConnectorDefArray = value;
	}



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
     */
	public get connectorCircleBody(): Matter.Body {
		return this._connectorCircleBody;
	}

    /**
     * Setter connectorCircleBody
     * @param {Matter.Body} value
     */
	public set connectorCircleBody(value: Matter.Body) {
		this._connectorCircleBody = value;
	}


    /**
     * Getter connectorCircleCurvePoints
     * @return {number}
     */
	public get connectorCircleCurvePoints(): number {
		return this._connectorCircleCurvePoints;
	}

    /**
     * Setter connectorCircleCurvePoints
     * @param {number} value
     */
	public set connectorCircleCurvePoints(value: number) {
		this._connectorCircleCurvePoints = value;
	}

    /**
     * Getter connectorCircleRadius
     * @return {number}
     */
	public get connectorCircleRadius(): number {
		return this._connectorCircleRadius;
	}

    /**
     * Setter connectorCircleRadius
     * @param {number} value
     */
	public set connectorCircleRadius(value: number) {
		this._connectorCircleRadius = value;
	}
    

}
