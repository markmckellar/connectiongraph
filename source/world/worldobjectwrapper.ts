import { WorldObject } from "./worldobject";
import { WorldPosition } from "./worldposition";
import { Drawable } from "../display/drawable";


export class WorldObjectWrapper extends WorldObject
{
	private _innerWorldObject:WorldObject;

  constructor(innerWorldObject:WorldObject) {
		super(innerWorldObject.worldId);
		this.innerWorldObject = innerWorldObject;
    }
	
    public getWorldPosition():WorldPosition {
			return(this.innerWorldObject.getWorldPosition());
		}

	public translate(worldPosition:WorldPosition):void {
		this.innerWorldObject.translate(worldPosition);
	}

	
	public setWorldPosition(worldPosition:WorldPosition):void {
		this.innerWorldObject.setWorldPosition(worldPosition);
	}

    public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(this.innerWorldObject.containsWorldPosition(worldPosition));
    }

    public getDrawable():Drawable {
		return(this.innerWorldObject.getDrawable());
    }


	public get innerWorldObject(): WorldObject {
		return this._innerWorldObject;
	}

	public set innerWorldObject(value: WorldObject) {
		this._innerWorldObject = value;
	}

}