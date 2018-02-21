import { WorldPosition } from "../../world/worldposition";
import { Drawable } from "../../display/drawable";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export interface EngineShape {	
	//private _shapeName:string;

    //constructor(shapeName:string)
    //{
	//	this.shapeName = shapeName;
	//}	
	
	getWorldPosition():WorldPosition;
	translate(worldPosition:WorldPosition):void;
	setWorldPosition(worldPosition:WorldPosition):void;
	containsWorldPosition(worldPosition:WorldPosition):boolean;
	getDrawable():Drawable;


	//public get shapeName(): string {
	//	return this._shapeName;
	//}

	//public set shapeName(value: string) {
	//	this._shapeName = value;
	//}
	
};