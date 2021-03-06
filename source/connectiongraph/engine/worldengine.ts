import { CircleEngineShape } from "./shapes/circleengineshape";
import { WorldId } from "../world/worldid";
import { WorldPosition } from "../world/worldposition";
import { Drawable } from "../display/drawable";
import { RectangleEngineShape } from "./shapes/rectangleengineshape";
import { PolygonEngineShape } from "./shapes/polygonengineshape";
import { CanvasMouse } from "../display/canvas/canvasmouse";
import { MouseEventHandler } from "../display/canvas/mouseeventhandler";
import { World } from "../world/world";
import { EngineShape } from "./shapes/engineshape";
import { TextEngineShape } from "./shapes/textengineshape";
import { DrawableText } from "../display/drawableshapes/drawabletext";
import { EngineConnector } from "./connectors/engineconnector";
import { EngineConnectorDef } from "./connectors/engineconnectordef";
import { DrawableConnector } from "../display/drawableshapes/drawableconnector";
import { WorldEngineParams } from "./worldengineparams";
import { AreaRuleObject } from "./arearule/arearuleobject/arearuleobject";


export interface WorldEngine {
    worldEngineParams:WorldEngineParams;
    areaRuleObjectArray:Array<AreaRuleObject>;

    // an area that contains/exclues a list of world objects.  the area of this filed is streatchy
    // a grouping of objects that applies a connection/repulsion between each member of the group
    
    getWorldStructureCollisionTag():string;

    createCircle(worldId:WorldId,drawable:Drawable,radius:number,numberOfSides:number,
        worldPosition:WorldPosition,options:any):CircleEngineShape;

    createRectangle(worldId:WorldId,drawable:Drawable,width:number,height:number,
        worldPosition:WorldPosition,options:any):RectangleEngineShape;

    createTextBox(worldId:WorldId,drawableText:DrawableText,
        width:number,height:number,worldPosition:WorldPosition,options:any):TextEngineShape;

    createPolygon(worldId:WorldId,drawable:Drawable,numberOfSides:number,radius:number,
        worldPosition:WorldPosition,options:any):PolygonEngineShape;

    getMouseAnchor():EngineShape;

    pointerDownEngineEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent,
        mouseEventHandler:MouseEventHandler):void;
        
    pointerMoveEngineEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent,
        mouseEventHandler:MouseEventHandler):void;

    pointerUpEngineEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent,
        mouseEventHandler:MouseEventHandler):void; 
    
    createBounds(width:number,height:number,options:any):void;

    startEngine():void;

    stopEngine():void;

    createConnector(worldId:WorldId,drawableConnector:DrawableConnector,
        connectorShape:EngineShape,engineConnectorDefArray:Array<EngineConnectorDef>,
        options:any):EngineConnector;

    
}