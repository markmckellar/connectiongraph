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
import { MatterConnectorDef } from "./matterconnectordef";

export class MatterConnector extends MatterShape implements EngineConnector
{
    private _drawableConnector:DrawableConnector;
    private _matterConnectorDefArray:Array<MatterConnectorDef>;

    private _connectorCircleBody:Matter.Body;
	private _connectorCircleCurvePoints:number;
	private _connectorCircleRadius:number;
	
    constructor(
        worldId:WorldId,
        drawableConnector:DrawableConnector,
        connectorShape:EngineShape,
        matterConnectorDefArray:Array<MatterConnectorDef>,
        position:WorldPosition,
        options:any,
        matterEngine:MatterEngine)
	{
       super(worldId,drawableConnector,options,matterEngine);
       this.drawableConnector = drawableConnector;
       this.matterConnectorDefArray = matterConnectorDefArray;



       this.connectorCircleRadius = 30; // REALLY?!?! it should be a param
       this.connectorCircleCurvePoints = 8; // REALLY?!?! it should be a param
       this.connectorCircleBody = Matter.Bodies.circle(
           position.x,position.y,
           this.connectorCircleRadius,
           options,
           this.connectorCircleCurvePoints);	
       //this.circleBody.collisionFilter.category = MatterEngine.boundsFilter;
       //matterEngine.addMatterShape(this);
        
       drawableConnector.init(this,options);
       //matterEngine.addMatterShape(this);

       for(let i=0;i<this.matterConnectorDefArray.length;i++) {
        let connectorDef:MatterConnectorDef = matterConnectorDefArray[i];
        let matterConstraint = Matter.Constraint.create(
            {
                bodyA: this.connectorCircleBody,
                bodyB: connectorDef.matterShape.getBody(),
                pointA: { x: -0, y: -0 },
                pointB: { x: -0, y: -0 },
                length:connectorDef.length,
                stiffness:connectorDef.stiffness
            });
        connectorDef.init(matterConstraint);
        //Matter.Body.setStatic(this.connectorCircleBody,true);
        //Matter.Body.setMass(this.connectorCircleBody,0.0001);
       }
       matterEngine.addMatterConnector(this);
       
    }

    public getBody():Matter.Body {
        return(this.connectorCircleBody);
    }

    public getEngineConnectorDefArray():Array<EngineConnectorDef> {
        return(this.matterConnectorDefArray);
    }


    public getMiddleWorldPosition():WorldPosition {
        let positions = new Array<WorldPosition>();
        for(let i=0;i<this.matterConnectorDefArray.length;i++) positions.push(this.matterConnectorDefArray[i].engineShape.getWorldPosition());
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
     * Getter matterConnectorDefArray
     * @return {Array<MatterConnectorDef>}
     */
	public get matterConnectorDefArray(): Array<MatterConnectorDef> {
		return this._matterConnectorDefArray;
	}

    /**
     * Setter matterConnectorDefArray
     * @param {Array<MatterConnectorDef>} value
     */
	public set matterConnectorDefArray(value: Array<MatterConnectorDef>) {
		this._matterConnectorDefArray = value;
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
