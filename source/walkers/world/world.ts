//import { MatterTools } from "../matterengine/mattertools";
//import { World } from "../walkerworld/world";
//import { MatterEvent } from "../matterengine/matterevent";
//import { MatterCollisionEvent } from "../matterengine/mattercollisionevent";
import { DisplayHolder } from "../display/displayholder";


export abstract class World {

    private _displayHolder:DisplayHolder;

    constructor(displayHolder:DisplayHolder){
        this.displayHolder = displayHolder;
    }

	public get displayHolder(): DisplayHolder {
		return this._displayHolder;
	}

	public set displayHolder(value: DisplayHolder) {
		this._displayHolder = value;
	}
    
}