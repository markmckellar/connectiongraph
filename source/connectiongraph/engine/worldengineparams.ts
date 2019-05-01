import { Drawable } from "../display/drawable";
import { World } from "../world/world";

export interface WorldEngineParams {
    mouseDrawableShape:Drawable;
    updateFunction: (world: World) => void;
    updateInterval:number;
    
}