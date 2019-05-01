import { EngineConnectorDef } from "../../connectors/engineconnectordef";
//import { SpringShape } from "./springshape";
import { SpringEngine } from "../springengine";
import { SpringShape } from "./springshape";

export class SpringConnectorDef extends EngineConnectorDef {
    public springShape:SpringShape;

    /*
    constructor(matterShape:MatterShape,length:number,stiffness:number) {
        super(matterShape,length,stiffness);
        this.matterShape = matterShape; 
        this.matterConstraint = null;
    }
    */

    constructor(springEngine:SpringEngine,engineConnectorDef:EngineConnectorDef) {

        super(engineConnectorDef.engineShape,engineConnectorDef.connectorPositioner,engineConnectorDef.length,engineConnectorDef.stiffness);

        this.springShape = springEngine.getSpringShape(engineConnectorDef.engineShape.getWorldId()); 

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
    /*
	public get springShape(): SpringShape {
		return this._springShape;
	}
*/
    /**
     * Setter mockShape
     * @param {MockShape} value
     */
    /*
	public set springShape(value: SpringShape) {
		this._springShape = value;
    }
    */


}