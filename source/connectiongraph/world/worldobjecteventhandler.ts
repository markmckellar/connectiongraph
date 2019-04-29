import { World } from "./world";
import { CanvasMouse } from "../display/canvas/canvasmouse";

export interface WorldObjectEventHandler {
    pointerDownEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
    pointerMoveEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
    pointerUpEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void;
}