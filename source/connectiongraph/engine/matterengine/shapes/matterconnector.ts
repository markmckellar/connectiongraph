import { WorldPosition } from "../../../world/worldposition";
import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { EngineConnector } from "../../connectors/engineconnector";
import { DrawableConnector } from "../../../display/drawableshapes/drawableconnector";
import { EngineConnectorDef } from "../../connectors/engineconnectordef";
import { WorldDisplay } from "../../../display/worlddisplay";
import { EngineShape } from "../../shapes/engineshape";
import { MatterConnectorDef } from "./matterconnectordef";
import { MatterEvent } from "../events/matterevent";

export class MatterConnector extends MatterShape implements EngineConnector
{
    private _drawableConnector:DrawableConnector;
    private _matterConnectorDefArray:Array<MatterConnectorDef>;
    private _connectorShape:EngineShape;
    private _matterShape:MatterShape;


	
    constructor(
        worldId:WorldId,
        drawableConnector:DrawableConnector,
        connectorShape:EngineShape,
        matterConnectorDefArray:Array<MatterConnectorDef>,
        options:any,
        matterEngine:MatterEngine)
	{
       super(worldId,drawableConnector,options,matterEngine);
       this.drawableConnector = drawableConnector;
       this.matterConnectorDefArray = matterConnectorDefArray;

       this.connectorShape = connectorShape;

       if(!matterEngine.matterShapes.has(connectorShape.getWorldId()))
            throw new Error("Error creating MatterConnectorDef, matterShape not found.  WorldId is : "+connectorShape.getWorldId().id);
       this.matterShape = matterEngine.matterShapes.get(connectorShape.getWorldId()); 


  	
       //this.circleBody.collisionFilter.category = MatterEngine.boundsFilter;
       //matterEngine.addMatterShape(this);
        
       drawableConnector.init(this,options);
       //matterEngine.addMatterShape(this);

       for(let i=0;i<this.matterConnectorDefArray.length;i++) {
        let connectorDef:MatterConnectorDef = matterConnectorDefArray[i];
        let matterConstraint = Matter.Constraint.create(
            {
                bodyA: this.matterShape.getBody(),
                bodyB: connectorDef.matterShape.getBody(),
                pointA: { x: -0, y: -0 },
                pointB: { x: -0, y: -0 },
                length:connectorDef.length,
                stiffness:connectorDef.stiffness
            });
        connectorDef.init(matterConstraint);
       }
       matterEngine.addMatterConnector(this);

       let self = this;
       matterEngine.registerCompositeEvent(
           this.worldId.id+"afterUpdate",
           MatterEvent.afterUpdate,           
           function(matterEngine:MatterEngine,eventType:MatterEvent,event:Matter.IEventComposite<Matter.Composite>):void
           {
                for(let i=0;i<self.getEngineConnectorDefArray().length;i++) {
                    let connectorDef = self.getEngineConnectorDefArray()[i];
                    connectorDef.connectorPositioner.positionConnectorShape(self,connectorDef);
                }
           }
        );

       //let averagePos = EngineConnectorDef.GetAverageConnecterDefPositon(this.getEngineConnectorDefArray());
       //this.matterShape.translate(averagePos);
       
    }

    public getBody():Matter.Body {
        return(this.matterShape.getBody());
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
        return(this.connectorShape.getWorldPosition());
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


    /**
     * Getter matterShape
     * @return {MatterShape}
     */
	public get matterShape(): MatterShape {
		return this._matterShape;
	}

    /**
     * Setter matterShape
     * @param {MatterShape} value
     */
	public set matterShape(value: MatterShape) {
		this._matterShape = value;
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


}
