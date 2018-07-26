import { EngineConnectorDef } from "../../shapes/engineconnectordef";
import { MockShape } from "./mockshape";
import { MockEngine } from "../mockengine";

export class MockConnectorDef extends EngineConnectorDef {
    private _mockShape:MockShape;
    private _matterConstraint:Matter.Constraint;

    /*
    constructor(matterShape:MatterShape,length:number,stiffness:number) {
        super(matterShape,length,stiffness);
        this.matterShape = matterShape; 
        this.matterConstraint = null;
    }
    */

    constructor(mockEngine:MockEngine,engineConnectorDef:EngineConnectorDef) {

        super(engineConnectorDef.engineShape,engineConnectorDef.length,engineConnectorDef.stiffness);
        /*
        if(!mockEngine.has(engineConnectorDef.engineShape.getWorldId()))
            throw new Error("Error creating MatterConnectorDef, matterShape not found.  WorldId is : "+
            engineConnectorDef.engineShape.getWorldId().id);
        this.matterShape = mockEngine.matterShapes.get(engineConnectorDef.engineShape.getWorldId()); 
        this.matterConstraint = null;
        */
    }

    public init():void {
    }

    /**
     * Getter mockShape
     * @return {MockShape}
     */
	public get mockShape(): MockShape {
		return this._mockShape;
	}

    /**
     * Setter mockShape
     * @param {MockShape} value
     */
	public set mockShape(value: MockShape) {
		this._mockShape = value;
	}


}