import { WorldPosition } from "../../../world/worldposition";
import { MatterTools } from "../mattertools";

import * as Matter from "matter-js";
import { EngineShape } from "../../shapes/engineshape";
import { Drawable } from "../../../display/drawable";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class MatterShape implements EngineShape
{
    private _drawable:Drawable;

    constructor(drawable:Drawable) {
        this.drawable = drawable;
    }
    
    public abstract getBody():Matter.Body;

    public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition( this. getBody() ) );
	}

	public translate(worldPosition:WorldPosition):void {
		Matter.Body.translate( this.getBody(),
			MatterTools.getVectorFromWorldPostion(worldPosition));
	}

	
	public setWorldPosition(worldPosition:WorldPosition):void {
		Matter.Body.translate( this. getBody(),
			MatterTools.getVectorFromWorldPostion(worldPosition));
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
