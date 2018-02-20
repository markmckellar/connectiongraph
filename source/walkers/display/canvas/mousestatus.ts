import { WorldPosition } from "../../world/worldposition";
import { WorldObject } from "../../world/worldobject";

export class MouseStatus
{
	private _isDown:boolean;
	private _startPosition:WorldPosition;
	private _position:WorldPosition;
	private _worldObject:WorldObject;
	//private _objectStartPosition:WorldPosition;
	private _offset:WorldPosition;
	private _lastWorldObject:WorldObject;
	
	
	

	constructor(isDown:boolean,startPosition:WorldPosition,position:WorldPosition)
	{
		this.isDown = isDown;
		this.startPosition = startPosition;
		this.position = position;
		this.worldObject = null;
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

	public get worldObject(): WorldObject {
		return this._worldObject;
	}

	public set worldObject(value: WorldObject) {
		this._worldObject = value;
	}


	public get offset(): WorldPosition {
		return this._offset;
	}

	public set offset(value: WorldPosition) {
		this._offset = value;
	}

	public get lastWorldObject(): WorldObject {
		return this._lastWorldObject;
	}

	public set lastWorldObject(value: WorldObject) {
		this._lastWorldObject = value;
	}
	
}
