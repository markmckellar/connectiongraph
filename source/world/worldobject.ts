import { WorldId } from "./worldid";
import { WorldPosition } from "./worldposition";
//import { WorldObjectDisplay } from "../display/worldobjectdisplay";
//import { EngineObject } from "../engine/engineobjects/engineobject";

export abstract class WorldObject {
	
	private _worldId : WorldId;  
	//private _worldObjectDisplayArray:Array<WorldObjectDisplay>;
	private _isAnimated:boolean;
	private _isSelected:boolean;
	//private _drawable:Drawable;
	//private _worldPosition:WorldPosition;
	////private _engineObject:EngineObject;
    
    public constructor(worldId:WorldId) {
		this.worldId = worldId;   
		//this.worldObjectDisplayArray = new Array<WorldObjectDisplay>();
        //console.log("WorldObject:"+this.worldId.id);
	}


    public abstract getWorldPosition():WorldPosition;
	public abstract translate(worldPosition:WorldPosition):void;
	public abstract setWorldPosition(worldPosition:WorldPosition):void;
	public abstract containsWorldPosition(worldPosition:WorldPosition):boolean;
	public abstract drawObject(context:CanvasRenderingContext2D):void;



	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}

/*
	public get worldObjectDisplayArray(): Array<WorldObjectDisplay> {
		return this._worldObjectDisplayArray;
	}

	public set worldObjectDisplayArray(value: Array<WorldObjectDisplay>) {
		this._worldObjectDisplayArray = value;
	}
*/

	public get isAnimated(): boolean {
		return this._isAnimated;
	}

	public set isAnimated(value: boolean) {
		this._isAnimated = value;
	}

	public get isSelected(): boolean {
		return this._isSelected;
	}

	public set isSelected(value: boolean) {
		this._isSelected = value;
	}

/*
	public get drawable(): Drawable {
		return this._drawable;
	}

	public set drawable(value: Drawable) {
		this._drawable = value;
	}
*/


	
}