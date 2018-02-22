import { World } from "../../world/world";
import { CanvasMouse } from "./canvasmouse";


export interface MouseEventHandler {
    pointerDownEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
    pointerMoveEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
    pointerUpEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
   // drag(mouseStatus:MouseStatus):void;
}