import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
//import { WorldObjectDisplay } from "../display/worldobjectdisplay";


export abstract class EngineObject {
	
	private _worldId : WorldId;  
    
    public constructor(worldId:WorldId) {
		this.worldId = worldId;          
    }

    public abstract getWorldPosition():WorldPosition;
    public abstract translate(worldPosition:WorldPosition):void;
    //public abstract scale(xScale:number,yScale:number):void;


	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}
	
}