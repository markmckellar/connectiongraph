import { World } from "../../world/world";
import { CanvasMouse } from "./canvasmouse";
import { WorldObject } from "../../world/worldobject";
import { MouseStatus } from "./mousestatus";


export interface MouseEventHandler {
    pointerDownEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent ):void;
    pointerMoveEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent ):void;
    pointerUpEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent ):void;
    getCurrentWorldObject():WorldObject;
    getMouseStatus():MouseStatus;
   // drag(mouseStatus:MouseStatus):void;
}