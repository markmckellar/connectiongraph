import { WorldId } from "./worldid";
import { WorldPosition } from "./worldposition";
import { Drawable } from "../display/drawable";
//import { WorldObjectDisplay } from "../display/worldobjectdisplay";
//import { EngineObject } from "../engine/engineobjects/engineobject";

export interface WorldObject {
    getWorldPosition():WorldPosition;
	translate(worldPosition:WorldPosition):void;
	setWorldPosition(worldPosition:WorldPosition):void;
	containsWorldPosition(worldPosition:WorldPosition):boolean;
	getDrawable():Drawable;
	isAnimated(): boolean;
	isSelected(): boolean;
	isVisable():boolean;
	getDrawable():Drawable;
	setAnimated(animated:boolean): void;
	setSelected(selected:boolean): void;
	setVisable(visable:boolean):void;
	getWorldId(): WorldId 
	getOptions():any;
	
}