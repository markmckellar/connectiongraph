import { EngineShape } from "./engineshape";
import { TextEngineShape } from "./textengineshape";
import { EngineConnectorDef } from "../connectors/engineconnectordef";
import { PositionerLockX } from "../connectors/connectorpositioners/positionerlockx";
import { BoundingBox } from "./boundingbox";
import { WorldDisplay } from "../../display/worlddisplay";
import { WorldPosition } from "../../world/worldposition";
import { CircleDisplayShape } from "../../display/drawableshapes/circledisplayshape";
import { WorldId } from "../../world/worldid";
import { CircleEngineShape } from "./circleengineshape";
import { EngineConnector } from "../connectors/engineconnector";
import { World } from "../../world/world";
import { LineConnectorDisplay } from "../../display/drawableshapes/lineconnectordisplay";
import { TextUpdateHandler } from "../../display/drawableshapes/textupdatehandler";
import { TextDisplayShape } from "../../display/drawableshapes/textdisplayshape";

export class ShapeAndText implements TextUpdateHandler {

    private _objectShape:EngineShape;
	private _textEngineShape:TextEngineShape;
	private _spacerLength:number;
	private _connector:EngineConnector;
	private _connectorShape:CircleEngineShape;
	
    constructor(world:World,objectShape:EngineShape,textEngineShape:TextEngineShape,spacerLength:number) {
		this.objectShape = objectShape;
		this.textEngineShape = textEngineShape;
		this.spacerLength = spacerLength;

		let objectBoundingBox:BoundingBox = new BoundingBox(this.objectShape.getShapePoints());
		let textShapeBoundingBox:BoundingBox = new BoundingBox(this.textEngineShape.getShapePoints());

		let objectSpringLength:number = 
			Math.abs(
				(objectBoundingBox.position.y+objectBoundingBox.height) -
				objectShape.getWorldPosition().y
				) +
				spacerLength/2;

		let textSpringLength:number = 
			Math.abs(
				(textShapeBoundingBox.position.y+textShapeBoundingBox.height) -
				textEngineShape.getWorldPosition().y
				) +
				spacerLength/2;				


		let connectorDefObjectet:EngineConnectorDef = new EngineConnectorDef(objectShape,new PositionerLockX(),objectSpringLength,0.01);
		let connectorDefText:EngineConnectorDef = new EngineConnectorDef(textEngineShape,new PositionerLockX(),textSpringLength,0.01);
		
		let middlePoint:WorldPosition = WorldDisplay.getAveragePostionFromPositionList([objectShape.getWorldPosition(),textEngineShape.getWorldPosition()]);

      	this.connectorShape = world.worldEngine.createCircle(
				new WorldId(objectShape.getWorldId().id+"-"+textEngineShape.getWorldId().id),
				new CircleDisplayShape(),
				5,8,
				middlePoint,
				{restitution:0.9}
			  );
		
		this.connector = world.worldEngine.createConnector(
			new WorldId(this.connectorShape.getWorldId().id+"-connector"),
			new LineConnectorDisplay(),
			this.connectorShape,
			[connectorDefObjectet,connectorDefText],
			{}
		  );
	}

	public handleTextUpdate(textDisplayShape:TextDisplayShape):void {

	}

	

    /**
     * Getter connectorShape
     * @return {CircleEngineShape}
     */
	public get connectorShape(): CircleEngineShape {
		return this._connectorShape;
	}

    /**
     * Setter connectorShape
     * @param {CircleEngineShape} value
     */
	public set connectorShape(value: CircleEngineShape) {
		this._connectorShape = value;
	}



    /**
     * Getter connector
     * @return {EngineConnector}
     */
	public get connector(): EngineConnector {
		return this._connector;
	}

    /**
     * Setter connector
     * @param {EngineConnector} value
     */
	public set connector(value: EngineConnector) {
		this._connector = value;
	}


    /**
     * Getter spacerLength
     * @return {number}
     */
	public get spacerLength(): number {
		return this._spacerLength;
	}

    /**
     * Setter spacerLength
     * @param {number} value
     */
	public set spacerLength(value: number) {
		this._spacerLength = value;
	}


    /**
     * Getter objectShape
     * @return {EngineShape}
     */
	public get objectShape(): EngineShape {
		return this._objectShape;
	}

    /**
     * Setter objectShape
     * @param {EngineShape} value
     */
	public set objectShape(value: EngineShape) {
		this._objectShape = value;
	}

    /**
     * Getter textEngineShape
     * @return {TextEngineShape}
     */
	public get textEngineShape(): TextEngineShape {
		return this._textEngineShape;
	}

    /**
     * Setter textEngineShape
     * @param {TextEngineShape} value
     */
	public set textEngineShape(value: TextEngineShape) {
		this._textEngineShape = value;
	}

    
}