import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";
//import { WorldPosition } from "../../world/worldposition";
//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export  interface PolygonEngineShape extends EngineShape
{
    getPolygonPoints():Array<WorldPosition>;
    getNumberOfSides():number;
    getRadius():number;
}
