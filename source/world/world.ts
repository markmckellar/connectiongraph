//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
import { DisplayHolder } from "../display/displayholder";
import { WorldEngine } from "../engine/worldengine";


export class World {

    private _displayHolder:DisplayHolder;
	private _worldEngine:WorldEngine;

    constructor(displayHolder:DisplayHolder,worldEngine:WorldEngine){
		this.displayHolder = displayHolder;
		this.worldEngine = worldEngine;
    }

	public get displayHolder(): DisplayHolder {
		return this._displayHolder;
	}

	public set displayHolder(value: DisplayHolder) {
		this._displayHolder = value;
	}

	public get worldEngine(): WorldEngine {
		return this._worldEngine;
	}

	public set worldEngine(value: WorldEngine) {
		this._worldEngine = value;
	}
    
}