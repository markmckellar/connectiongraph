import { WorldShape } from "./shapes/worldshape";
import { World } from "../walkerworld/world";
import { WorldObjectDisplay } from "./worldobjectdisplay";
import { CircleDisplayShape } from "./shapes/circledisplayshape";
import { WorldPosition } from "../walkerworld/worldposition";





export abstract class WorldObjectDisplayFactory {
    private _shapePoints:Array<WorldShape>;  
    
    constructor() {
    }

    public getWorldObjectDisplay(someKinaTag:string):WorldObjectDisplay {

        someKinaTag = "junction";

        let options:Object =
            {
                shapes:
                [
                    {
                        worldId:"worldId",
                        shapeName:"junctionCircle",
                        worldObjectShape:new CircleDisplayShape("junctionCircle",40,8,new WorldPosition(0,0)),
                        fgcolor:"ff0000ff",
                        bgcolor:"0000ffff",
                        lineWidth:4,
                    },
                ],
            };

    }
}