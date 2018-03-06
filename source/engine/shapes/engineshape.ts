import { WorldObject } from "../../world/worldobject";
import { WorldPosition } from "../../world/worldposition";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export interface EngineShape extends WorldObject {	
    getShapePoints():Array<WorldPosition>;
};