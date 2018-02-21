import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
import { WorldObject } from "../../world/worldobject";
import { EngineShape } from "../shapes/engineshape";

//import { WorldObjectDisplay } from "../display/worldobjectdisplay";


export abstract class EngineObject extends WorldObject {
    
    public constructor(worldId:WorldId) {
		super(worldId);  
		//this.worldId = worldId;        
	}
	
	public abstract getEngineShape():EngineShape;	

	public getWorldPosition() {
		return(this.getEngineShape().getWorldPosition());
	}
	public translate(worldPosition:WorldPosition):void {
		this.getEngineShape().translate(worldPosition);

	}
	public setWorldPosition(worldPosition:WorldPosition) {
		this.getEngineShape().setWorldPosition(worldPosition);

	}
	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(this.getEngineShape().containsWorldPosition(worldPosition));
	}

	
}