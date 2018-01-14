import { WorldId } from "./worldid";


export class WorldObject {
	
    private _worldId : WorldId;   
    
    public constructor(worldId:WorldId) {
        this.worldId = worldId;          
        console.log("WorldObject:"+this.worldId.id);
    }


	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}
    
}