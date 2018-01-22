import { MatterEngine } from "./matterengine";
import { WorldId } from "../worldid";

import * as Matter from "matter-js";



export class MatterObject  {
    private _worldId:WorldId;


	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}

}