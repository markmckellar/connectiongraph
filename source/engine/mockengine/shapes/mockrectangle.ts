import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";
import { MockEngine } from "../mockengine";

export class MockRectangle extends MockShape implements RectangleEngineShape
{
	private _width:number;
	private _height:number;

	constructor(worldId:WorldId,drawable:Drawable,width:number,height:number,position:WorldPosition,options:any,mockEngine:MockEngine)
	{
		super(worldId,drawable,position,options);
		this.width = width;
		this.height = height;	
		drawable.init(this,options);
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(
			(
							(worldPosition.x-this.getWidth()/2)<=worldPosition.x &&
							(worldPosition.x+this.getWidth()/2)>=worldPosition.x &&
							(worldPosition.y-this.getHeight()/2)<=worldPosition.y &&
							(worldPosition.y+this.getHeight()/2)>=worldPosition.y
			)
	);

	}

	public getWidth():number {
		return(this.width);
	}
	public getHeight():number {
		return(this.height);
	}

	public get width(): number {
		return this._width;
	}

	public set width(value: number) {
		this._width = value;
	}

	public get height(): number {
		return this._height;
	}

	public set height(value: number) {
		this._height = value;
	}



}
