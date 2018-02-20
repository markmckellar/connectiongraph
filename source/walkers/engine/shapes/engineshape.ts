import { WorldPosition } from "../../world/worldposition";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export interface EngineShape {	
	//private _shapeName:string;

    //constructor(shapeName:string)
    //{
	//	this.shapeName = shapeName;
	//}	
	
    getWorldPosition():WorldPosition;

	//public get shapeName(): string {
	//	return this._shapeName;
	//}

	//public set shapeName(value: string) {
	//	this._shapeName = value;
	//}
	
};