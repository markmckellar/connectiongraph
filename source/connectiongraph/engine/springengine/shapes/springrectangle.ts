import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { SpringShape } from "./springshape";
import { WorldId } from "../../../world/worldid";
import { SpringEngine } from "../springengine";

export class SpringRectangle extends SpringShape implements RectangleEngineShape
{
	private _width:number;
	private _height:number;

	constructor(worldId:WorldId,drawable:Drawable,width:number,height:number,position:WorldPosition,options:any,springEngine:SpringEngine)
	{
		super(worldId,drawable,position,options);
		this.width = width;
		this.height = height;	
		drawable.init(this,options);
	}

	public setSize(width:number,height:number) {
		this.width = width;
		this.height = height;
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(
			(
							(this.getWorldPosition().x-this.getWidth()/2)<=worldPosition.x &&
							(this.getWorldPosition().x+this.getWidth()/2)>=worldPosition.x &&
							(this.getWorldPosition().y-this.getHeight()/2)<=worldPosition.y &&
							(this.getWorldPosition().y+this.getHeight()/2)>=worldPosition.y
			)
		);
	}

	public getShapePoints():Array<WorldPosition> {
		//return( WorldDisplay.getPolygonPoints(Math.PI/4,4,this.getWidth()+this.get,this.getWorldPosition() ) ;
		let polygonPointArray = Array<WorldPosition>();	


		polygonPointArray.push( new WorldPosition(
			this.getWorldPosition().x+this.getWidth()/2,
			this.getWorldPosition().y+this.getHeight()/2 ) );

		polygonPointArray.push( new WorldPosition(
			this.getWorldPosition().x+this.getWidth()/2,
			this.getWorldPosition().y-this.getHeight()/2 ) );

		polygonPointArray.push( new WorldPosition(
			this.getWorldPosition().x-this.getWidth()/2,
			this.getWorldPosition().y-this.getHeight()/2 ) );

		polygonPointArray.push( new WorldPosition(
			this.getWorldPosition().x-this.getWidth()/2,
			this.getWorldPosition().y+this.getHeight()/2 ) );

		return(polygonPointArray);    }

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
