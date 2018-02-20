import { WorldPosition } from "../../world/worldposition";
import { WorldObject } from "../../world/worldobject";

export class MouseStatus
{
	private _isDown:boolean;
	private _startPosition:WorldPosition;
	private _position:WorldPosition;
	//private _worldObject:WorldObject;
	//private _objectStartPosition:WorldPosition;
	private _clickOffset:WorldPosition;
	//private _lastWorldObject:WorldObject;
	
	
	

	constructor()
	{
		this.isDown = false;
		this.startPosition = new WorldPosition(0,0);
		this.position = new WorldPosition(0,0);
		this.clickOffset = new WorldPosition(0,0);

		//this.objectStartPosition = null
	}
// 			nodeCanvasMouse.mouseStatus = new MouseStatus(false,new Position(0,0),new Position(0,0),null,null);


	public get isDown(): boolean {
		return this._isDown;
	}

	public set isDown(value: boolean) {
		this._isDown = value;
	}

	public get startPosition(): WorldPosition {
		return this._startPosition;
	}

	public set startPosition(value: WorldPosition) {
		this._startPosition = value;
	}
	

	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}

	public get clickOffset(): WorldPosition {
		return this._clickOffset;
	}

	public set clickOffset(value: WorldPosition) {
		this._clickOffset = value;
	}



	
}
