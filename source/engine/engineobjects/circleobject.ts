//import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
//import { EngineObject } from "./engineobject";
import { CircleEngineShape } from "../../engine/shapes/circleengineshape";
//import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldId } from "../../world/worldid";
import { EngineObject } from "./engineobject";
import { EngineShape } from "../shapes/engineshape";

//import { WorldObjectDisplay } from "../display/worldobjectdisplay";


export class CircleObject extends EngineObject {
	//getCircle(): CircleEngineShape;

	private _circleEngineShape:CircleEngineShape;

    public constructor(worldId:WorldId,circleEngineShape:CircleEngineShape) {
		super(worldId);
		this.circleEngineShape = circleEngineShape;
	}

	public getEngineShape():EngineShape {
		return(this.circleEngineShape);
	}

	
	public get circleEngineShape(): CircleEngineShape {
		return this.circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this.circleEngineShape = value;
	}

	public drawObject(context:CanvasRenderingContext2D):void {
		this.circleEngineShape.getDrawable().draw(context);
	}

	
}