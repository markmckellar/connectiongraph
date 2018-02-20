import { MouseStatus } from "./mousestatus";
import { WorldObject } from "../../world/worldobject";
import { World } from "../../world/world";


export interface MouseEventHandler {
    pointerDownEvent(world:World,event:MouseEvent):void;
    pointerMoveEvent(world:World,event:MouseEvent):void;
    pointerUpEvent(world:World,event:MouseEvent):void;
   // drag(mouseStatus:MouseStatus):void;
}