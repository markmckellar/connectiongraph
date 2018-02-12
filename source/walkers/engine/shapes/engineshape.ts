import { WorldPosition } from "../../world/worldposition";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export abstract  class EngineShape {	
	private _shapeName:string;

    constructor(shapeName:string)
    {
		this.shapeName = shapeName;
	}	
	
    public abstract getWorldPosition():WorldPosition;

	public get shapeName(): string {
		return this._shapeName;
	}

	public set shapeName(value: string) {
		this._shapeName = value;
	}
	
};