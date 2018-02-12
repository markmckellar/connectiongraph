import { WorldId } from "./worldid";
import { WorldObjectDisplay } from "../display/worldobjectdisplay";
import { EngineObject } from "../engine/engineobject";


export class WorldObject {
	
	private _worldId : WorldId;  
	private _worldObjectDisplay:WorldObjectDisplay; 
	private _engineObject:EngineObject;
    
    public constructor(worldId:WorldId,worldObjectDisplay:WorldObjectDisplay,engineObject:EngineObject) {
		this.worldId = worldId;          
		this.worldObjectDisplay = worldObjectDisplay;
		this.engineObject = engineObject;
        //console.log("WorldObject:"+this.worldId.id);
    }


	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}
	

	public get engineObject(): EngineObject {
		return this._engineObject;
	}

	public set engineObject(value: EngineObject) {
		this._engineObject = value;
	}


	public get worldObjectDisplay(): WorldObjectDisplay {
		return this._worldObjectDisplay;
	}

	public set worldObjectDisplay(value: WorldObjectDisplay) {
		this._worldObjectDisplay = value;
	}
	
}