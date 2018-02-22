import { WorldPosition } from "../../../world/worldposition";
import { CircleEngineShape } from "../../../engine/shapes/circleengineshape";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { Drawable } from "../../../display/drawable";
import { EngineShape } from "../../../engine/shapes/engineshape";



export class JunctionOneCircle extends WorldObject implements Drawable {


	private _circleEngineShape:CircleEngineShape;

    public constructor(worldId:WorldId,circleEngineShape:CircleEngineShape) {
		super(worldId);
		this.circleEngineShape = circleEngineShape;
	}

	public getWorldPosition() {
		return(this.circleEngineShape.getWorldPosition());
	}
	
	public translate(worldPosition:WorldPosition):void {
		this.circleEngineShape.translate(worldPosition);

	}
	public setWorldPosition(worldPosition:WorldPosition) {
		this.circleEngineShape.setWorldPosition(worldPosition);

	}
	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(this.circleEngineShape.containsWorldPosition(worldPosition));
	}


	public drawObject(context:CanvasRenderingContext2D):void {
		this.circleEngineShape.getDrawable().draw(context);
	}

	public get circleEngineShape(): CircleEngineShape {
		return this._circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this._circleEngineShape = value;
	}

	
	public getDrawable():Drawable {
		return( this );	
	}

	public draw(context:CanvasRenderingContext2D):void {
        this.circleEngineShape.getDrawable().draw(context);
	}

	public init(engineShape:EngineShape,options:any):void {
	}

	
}