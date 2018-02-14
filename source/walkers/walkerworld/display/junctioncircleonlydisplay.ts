import { WorldPosition } from "../../world/worldposition";
import { WorldObject } from "../../world/worldobject";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../../display/worldobjectdisplay";
import { CircleDisplayShape } from "../../display/shapes/circledisplayshape";


export class JunctionCircleOnlyDisplay extends WorldObjectDisplay {

    private _junctionBody:CircleDisplayShape;

    constructor(worldPosition:WorldPosition,walkerWorld:WalkerWorld) {
        super(worldPosition);
        this.junctionBody = new CircleDisplayShape("junctionBody",40,worldPosition,walkerWorld.walkerEngine)

    }

    public drawObject(walkerWorld:WalkerWorld,worldObject:WorldObject,context:CanvasRenderingContext2D):void{   

        this.junctionBody.drawShape(this,walkerWorld,context);

    }

	public get junctionBody(): CircleDisplayShape {
		return this._junctionBody;
	}

	public set junctionBody(value: CircleDisplayShape) {
		this._junctionBody = value;
	}


}