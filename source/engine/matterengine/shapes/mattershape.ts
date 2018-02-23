import { WorldPosition } from "../../../world/worldposition";
import { MatterTools } from "../mattertools";

import * as Matter from "matter-js";
import { EngineShape } from "../../shapes/engineshape";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class MatterShape  extends WorldObject implements EngineShape
{
    private _drawable:Drawable;

    constructor(worldId:WorldId,drawable:Drawable) {
		super(worldId);
        this.drawable = drawable;
    }
    
    public abstract getBody():Matter.Body;

    public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition( this. getBody() ) );
	}

	public translate(worldPosition:WorldPosition):void {
		let newX = worldPosition.x-this.getBody().position.x;
		let newY = worldPosition.y-this.getBody().position.y;

		Matter.Body.translate( this.getBody(),Matter.Vector.create(
			newX,newY ));
	}
	
	public setWorldPosition(worldPosition:WorldPosition):void {
		let newX = worldPosition.x-this.getBody().position.x;
		let newY = worldPosition.y-this.getBody().position.y;

		Matter.Body.translate( this.getBody(),Matter.Vector.create(
			newX,newY ));
	}
	
	public containsWorldPosition(worldPosition:WorldPosition):boolean {

		return( Matter.Vertices.contains( this. getBody().vertices, MatterTools.getVectorFromWorldPostion(worldPosition)) );
	}

    public getDrawable():Drawable {
        return(this.drawable);
    }


	public get drawable(): Drawable {
		return this._drawable;
	}

	public set drawable(value: Drawable) {
		this._drawable = value;
	}
    

}
