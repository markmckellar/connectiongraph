import { Drawable } from "../drawable";

//import { WorldShape } from "./shapes/worldshape";
//import { WorldObject } from "../world/worldobject";
//import { WalkerWorld } from "../walkers/walkerworld/walkerworld";
//import { WorldPosition } from "../world/worldposition";


export interface DrawableText extends Drawable{
	//private _shapes:Map<string,WorldShape>;
	//private _position:WorldPosition;
	
    
    //constructor(position:WorldPosition) {
    setText(displayText:string):void;
    getText():string;
    
}