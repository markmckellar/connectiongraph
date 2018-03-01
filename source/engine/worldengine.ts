import { CircleEngineShape } from "./shapes/circleengineshape";
import { WorldId } from "../world/worldid";
import { WorldPosition } from "../world/worldposition";
import { Drawable } from "../display/drawable";

/*
import { Walker } from "../walkerworld/walker";
import { Junction } from "../walkerworld/junction";
import { Destination } from "../walkerworld/destination";
import { Path } from "../walkerworld/path";
import { World } from "../walkerworld/world";
import { WorldPosition } from "../world/worldposition";
*/
//import { WorldPosition } from "../world/worldposition";
//import { WorldObject } from "../world/worldobject";


export interface WorldEngine {

    createCircle(worldId:WorldId,drawable:Drawable,radius:number,numberOfSides:number,worldPosition:WorldPosition,options:any):CircleEngineShape;
    //getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject;
    //public constructor() {
    //}
/*
    setJunctionPosition(junction:Junction,position:WorldPosition):void;
    addWalker(world:World,walker:Walker):void;
    getJunctionPosition(junction:Junction):WorldPosition;
    addJunction(world:World,junction:Junction,position:WorldPosition):void;
    hasJunction(junction:Junction):boolean;    
    addDestination(world:World,destination:Destination):void;
    addPath(world:World,path:Path):void;
    createBounds(width:number,height:number):void; 
    changeWalkerDestination(world:World,walker:Walker,destination:Destination):void;
    isWalkerAtDestination(world:World,walker:Walker):void;       
*/
   // public abstract doesWalkerExist(world:World,walker:Walker):boolean;
    //public abstract doesJunctionExist(world:World,junction:Junction):boolean;
    //public abstract doesPathExist(world:World,path:Path):boolean;
}