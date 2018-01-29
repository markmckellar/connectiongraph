import { WorldId } from "./worldid";
import { WorldObjectDisplay } from "../renderer/worldobjectdisplay";


export class WorldObject {
	
	private _worldId : WorldId;  
	private _worldObjectDisplay:WorldObjectDisplay; 
    
    public constructor(worldId:WorldId,worldObjectDisplay:WorldObjectDisplay) {
		this.worldId = worldId;          
		this.worldObjectDisplay = worldObjectDisplay;
        //console.log("WorldObject:"+this.worldId.id);
    }


	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}
	

	public get worldObjectDisplay(): WorldObjectDisplay {
		return this._worldObjectDisplay;
	}

	public set worldObjectDisplay(value: WorldObjectDisplay) {
		this._worldObjectDisplay = value;
	}
	
}