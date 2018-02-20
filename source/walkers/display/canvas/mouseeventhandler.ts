import { MouseStatus } from "./mousestatus";
import { WorldObject } from "../../world/worldobject";


export interface MouseEventHandler {
    pointerDown(mouseStatus:MouseStatus):void;
    objectedSelected(mouseStatus:MouseStatus):void;
    objectedDeselected(mouseStatus:MouseStatus):void;
    
    
}