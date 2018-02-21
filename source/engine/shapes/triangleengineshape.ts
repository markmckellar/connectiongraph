import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";


export interface PolygonEngineShape extends EngineShape
{
	getPointList():Array<WorldPosition>;	
}
