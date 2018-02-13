import { EngineObject } from "../engine/engineobject";

//import { MatterEngine } from "./matterengine";
//import { WorldId } from "../world/worldid";
import { WorldPosition } from "../world/worldposition";
import * as Matter from "matter-js";

export abstract class MatterObject extends EngineObject {
	
	public bodyPostion2WorldPosition(body:Matter.Body):WorldPosition {
		return( new WorldPosition(body.position.x,body.position.y) );
	}
}