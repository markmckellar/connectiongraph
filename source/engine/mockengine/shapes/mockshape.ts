import { WorldPosition } from "../../../world/worldposition";

import { EngineShape } from "../../shapes/engineshape";
import { Drawable } from "../../../display/drawable";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class MockShape implements EngineShape
{
	private _drawable:Drawable;
	private _position:WorldPosition;

    constructor(drawable:Drawable,position:WorldPosition) {
		this.drawable = drawable;
		this.position = position;
    }
    

    public getWorldPosition():WorldPosition {
		return(this.position );
	}

	public translate(worldPosition:WorldPosition):void {
		this.position.x = worldPosition.x;
		this.position.y = worldPosition.y;
	}

	
	public setWorldPosition(worldPosition:WorldPosition):void {
		this.position.x = worldPosition.x;
		this.position.y = worldPosition.y;
	}

	public abstract containsWorldPosition(worldPosition:WorldPosition):boolean;

    public getDrawable():Drawable {
        return(this.drawable);
    }


	public get drawable(): Drawable {
		return this._drawable;
	}

	public set drawable(value: Drawable) {
		this._drawable = value;
	}
    

	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}

}