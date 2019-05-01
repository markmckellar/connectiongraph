import { EngineShape } from "../shapes/engineshape";
import { ConnectorPositioner } from "./connectorpositioners/connectorpositioner";

export class EngineConnectorDef {
    private _engineShape:EngineShape;
    private _length:number;
    private _stiffness:number;    

    private _connectorPositioner:ConnectorPositioner;

    constructor(engineShape:EngineShape,connectorPositioner:ConnectorPositioner,length:number,stiffness:number) {
        this.engineShape = engineShape;
        this.connectorPositioner = connectorPositioner;
        this.length = length;
        this.stiffness = stiffness;
    }
/*
    public static getWorldPositionArrayFromEngineDefs(engineConnectorDefArray:Array<EngineConnectorDef>):Array<WorldPosition> {
		let worldPositionArray:Array<WorldPosition> = new Array<WorldPosition>();
		for(let n = 0; n < engineConnectorDefArray.length; n++)
		{
			worldPositionArray.push(engineConnectorDefArray[n].engineShape.getWorldPosition());
		}
		return(worldPositionArray);
   }
*/

    /**
     * Getter connectorPositioner
     * @return {ConnectorPositioner}
     */
	public get connectorPositioner(): ConnectorPositioner {
		return this._connectorPositioner;
	}

    /**
     * Setter connectorPositioner
     * @param {ConnectorPositioner} value
     */
	public set connectorPositioner(value: ConnectorPositioner) {
		this._connectorPositioner = value;
	}

    /**
     * Getter length
     * @return {number}
     */
	public get length(): number {
		return this._length;
	}

    /**
     * Setter length
     * @param {number} value
     */
	public set length(value: number) {
		this._length = value;
	}

    /**
     * Getter stiffness
     * @return {number}
     */
	public get stiffness(): number {
		return this._stiffness;
	}

    /**
     * Setter stiffness
     * @param {number} value
     */
	public set stiffness(value: number) {
		this._stiffness = value;
	}
    

    /**
     * Getter engineShape
     * @return {EngineShape}
     */
	public get engineShape(): EngineShape {
		return this._engineShape;
	}

    /**
     * Setter engineShape
     * @param {EngineShape} value
     */
	public set engineShape(value: EngineShape) {
		this._engineShape = value;
	}
}