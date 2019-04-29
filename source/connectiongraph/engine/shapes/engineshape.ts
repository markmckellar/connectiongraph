import { WorldObject } from "../../world/worldobject";
import { WorldPosition } from "../../world/worldposition";

export interface EngineShape extends WorldObject {	
    getShapePoints():Array<WorldPosition>;
    scaleShape(scaleX:number,scaleY:number):void;
};