import { Walker } from "../walkerworld/walker";
import { Junction } from "../walkerworld/junction";
import { Destination } from "../walkerworld/destination";
import { Path } from "../walkerworld/path";
import { WalkerWorld } from "../walkerworld/walkerworld";
//import { WorldId } from "../world/worldid";
import { WorldPosition } from "../../world/worldposition";

//import { CircleEngineShape } from "../engine/shapes/circleengineshape";
import { JunctionOneCircle } from "../engine/engineobjects/junctiononecircle";
import { WorldEngine } from "../engine/worldengine";


export interface WalkerEngine extends WorldEngine {

    
    //public constructor() {
    //}

    //setJunctionPosition(junction:Junction,position:WorldPosition):void;
    addWalker(walkerWorld:WalkerWorld,walker:Walker):void;
    getJunctionPosition(junction:Junction):WorldPosition;
    //addJunction(walkerWorld:WalkerWorld,junction:Junction,position:WorldPosition):void;
    hasJunction(junction:Junction):boolean;    
    addDestination(walkerWorld:WalkerWorld,destination:Destination):void;
    addPath(walkerWorld:WalkerWorld,path:Path):void;
    createBounds(width:number,height:number):void; 
    changeWalkerDestination(walkerWorld:WalkerWorld,walker:Walker,destination:Destination):void;
    isWalkerAtDestination(walkerWorld:WalkerWorld,walker:Walker):void;       


    //getNewCircleEngineShape(shapeName:string,radius:number,worldPosition:WorldPosition):CircleEngineShape;

    //     getJunctionOneCircle(junction:Junction,worldPosition:WorldPosition,walkerWorld:WalkerWorld):JunctionOneCircle {

    getJunctionOneCircle(junction:Junction,worldPosition:WorldPosition,walkerWorld:WalkerWorld):JunctionOneCircle;

   // public abstract doesWalkerExist(world:World,walker:Walker):boolean;
    //public abstract doesJunctionExist(world:World,junction:Junction):boolean;
    //public abstract doesPathExist(world:World,path:Path):boolean;
}