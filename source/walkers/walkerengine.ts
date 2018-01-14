import { Walker } from "./walker";
import { Junction } from "./junction";
import { Destination } from "./destination";
import { Path } from "./path";
import { World } from "./world";

export abstract class WalkerEngine {

    
    public constructor() {
    }

    public abstract addWalker(world:World,walker:Walker):void;
    public abstract addJunction(world:World,junction:Junction):void;
    public abstract addDestination(world:World,destination:Destination):void;
    public abstract addPath(world:World,path:Path):void;
    public abstract createBounds(width:number,height:number):void;        

   // public abstract doesWalkerExist(world:World,walker:Walker):boolean;
    //public abstract doesJunctionExist(world:World,junction:Junction):boolean;
    //public abstract doesPathExist(world:World,path:Path):boolean;
}