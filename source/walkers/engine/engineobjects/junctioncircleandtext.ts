import { WorldPosition } from "../../../world/worldposition";
import { CircleEngineShape } from "../../../engine/shapes/circleengineshape";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { RectangleEngineShape } from "../../../engine/shapes/rectangleengineshape";
import { Drawable } from "../../../display/drawable";
import { EngineShape } from "../../../engine/shapes/engineshape";

export class JunctionCircleAndText extends WorldObject implements Drawable {

    private _circleEngineShape:CircleEngineShape;
    private _rectangleEngineShape:RectangleEngineShape;

    public constructor(worldId:WorldId,circleEngineShape:CircleEngineShape,rectangleEngineShape:RectangleEngineShape) {
		super(worldId);
        this.circleEngineShape = circleEngineShape;
        this.rectangleEngineShape = rectangleEngineShape;
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
		return(
            this.circleEngineShape.containsWorldPosition(worldPosition) ||
            this.rectangleEngineShape.containsWorldPosition(worldPosition)
        );
	}

	public get circleEngineShape(): CircleEngineShape {
		return this._circleEngineShape;
	}

	public set circleEngineShape(value: CircleEngineShape) {
		this._circleEngineShape = value;
	}
    

	public get rectangleEngineShape(): RectangleEngineShape {
		return this._rectangleEngineShape;
	}

	public set rectangleEngineShape(value: RectangleEngineShape) {
		this._rectangleEngineShape = value;
	}

	public getDrawable():Drawable {
		return( this );	
	}

	public draw(context:CanvasRenderingContext2D):void {
        this.circleEngineShape.getDrawable().draw(context);
        this.rectangleEngineShape.getDrawable().draw(context);
	}

	public init(engineShape:EngineShape,options:any):void {
	}

	
}