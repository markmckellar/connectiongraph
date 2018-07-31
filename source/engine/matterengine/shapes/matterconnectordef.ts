import { EngineConnectorDef } from "../../connectors/engineconnectordef";
import { MatterShape } from "./mattershape";
import { MatterEngine } from "../matterengine";

export class MatterConnectorDef extends EngineConnectorDef {
    private _matterShape:MatterShape;
    private _matterConstraint:Matter.Constraint;

    /*
    constructor(matterShape:MatterShape,length:number,stiffness:number) {
        super(matterShape,length,stiffness);
        this.matterShape = matterShape; 
        this.matterConstraint = null;
    }
    */

    constructor(matterEngine:MatterEngine,engineConnectorDef:EngineConnectorDef) {
        super(engineConnectorDef.engineShape,engineConnectorDef.connectorPositioner,engineConnectorDef.length,engineConnectorDef.stiffness);
        if(!matterEngine.matterShapes.has(engineConnectorDef.engineShape.getWorldId()))
            throw new Error("Error creating MatterConnectorDef, matterShape not found.  WorldId is : "+
            engineConnectorDef.engineShape.getWorldId().id);
        this.matterShape = matterEngine.matterShapes.get(engineConnectorDef.engineShape.getWorldId()); 
        this.matterConstraint = null;
    }

    public init(matterConstraint:Matter.Constraint):void {
        this.matterConstraint = matterConstraint
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
     * Getter matterConstraint
     * @return {Matter.Constraint}
     */
	public get matterConstraint(): Matter.Constraint {
		return this._matterConstraint;
	}

    /**
     * Setter matterConstraint
     * @param {Matter.Constraint} value
     */
	public set matterConstraint(value: Matter.Constraint) {
		this._matterConstraint = value;
	}

}