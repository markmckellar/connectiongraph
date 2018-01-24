import { Walker } from "../walkerworld/walker";
import { Junction } from "../walkerworld/junction";
import { Destination } from "../walkerworld/destination";
import { Path } from "../walkerworld/path";
import { World } from "../walkerworld/world";

export interface WalkerEngine {

    
    //public constructor() {
    //}

    addWalker(world:World,walker:Walker):void;
    addJunction(world:World,junction:Junction):void;
    addDestination(world:World,destination:Destination):void;
    addPath(world:World,path:Path):void;
    createBounds(width:number,height:number):void; 
    changeWalkerDestination(world:World,walker:Walker,destination:Destination):void;
    isWalkerAtDestination(world:World,walker:Walker):void;       

   // public abstract doesWalkerExist(world:World,walker:Walker):boolean;
    //public abstract doesJunctionExist(world:World,junction:Junction):boolean;
    //public abstract doesPathExist(world:World,path:Path):boolean;
}