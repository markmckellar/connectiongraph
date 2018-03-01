//import { WorldShape } from "./shapes/worldshape";
import { WalkerWorld } from "../walkers/walkerworld/walkerworld";
import { Junction } from "../walkers/walkerworld/junction";

//import { WorldObjectDisplay } from "./worldobjectdisplay";
//import { CircleDisplayShape } from "./shapes/circledisplayshape";
import { WorldPosition } from "../world/worldposition";
//import { WorldObject } from "../world/worldobject";
//import { JunctionCircleOnlyDisplay } from "../walkers/walkerworld/display/junctioncircleonlydisplay";


export class WorldObjectDisplayFactory {
   // private _shapePoints:Array<WorldShape>;  
    
    public constructor() {
    }

    public static geJunctionWorldObjectDisplay(someKinaTag:string,junction:Junction,worldPosition:WorldPosition,walkerWorld:WalkerWorld):void {

        someKinaTag = "junction";
        /*
        let options:Object =
            {
                shapes:
                [
                    {
                        worldObjectShape:function(){new CircleDisplayShape("default",40,8,new WorldPosition(0,0))},
                        fgcolor:"ff0000ff",
                        bgcolor:"0000ffff",
                        lineWidth:4,
                    },
                    {
                        worldObjectShape:function(){new CircleDisplayShape("junctionCircle",40,8,new WorldPosition(0,0))},
                        fgcolor:"ff0000ff",
                        bgcolor:"0000ffff",
                        lineWidth:4,
                    },
                ],
            };
        */
        // constructor(position:WorldPosition,shapes:Map<string,WorldShape>) {
        // public abstract drawObject(worldObjectDisplay:WorldObjectDisplay,world:World):void;

        //let shapes:Map<string,WorldShape> = new Map<string,WorldShape>();
        //shapes.set("junctionBody",new CircleDisplayShape("junctionBody",40,worldPosition,walkerWorld.walkerEngine) );
        //let wod:WorldObjectDisplay = new JunctionCircleOnlyDisplay(walkerWorld.walkerEngine.getJunctionOneCircle(junction,worldPosition,walkerWorld));
        /*
        new(class extends WorldObjectDisplay {
            public drawObject(walkerWorld:WalkerWorld,worldObject:WorldObject,context:CanvasRenderingContext2D):void{   

                this.getShape(worldObject,"junctionBody").drawShape(this,walkerWorld,context);

                }
            } )(new WorldPosition(0,0),shapes);
    */
        ///////////return(wod);

    }
}