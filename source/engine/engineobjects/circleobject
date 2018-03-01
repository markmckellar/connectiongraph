import { CircleEngineShape } from "../../engine/shapes/circleengineshape";
import { WorldId } from "../../world/worldid";
import { EngineObject } from "./engineobject";
import { EngineShape } from "../shapes/engineshape";
import { Drawable } from "../../display/drawable";

export class CircleObject extends EngineObject {

	private _circleEngineShape:CircleEngineShape;

    public constructor(worldId:WorldId,circleEngineShape:CircleEngineShape) {
		super(worldId);
		this.circleEngineShape = circleEngineShape;
	}

	public getEngineShape():EngineShape {
		return(this.circleEngineShape);
	}

	public getDrawable():Drawable {
		return( this.circleEngineShape.getDrawable() );	
	}

	public get circleEngineShape(): CircleEngineShape {
		return this._circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this._circleEngineShape = value;
	}

	
}