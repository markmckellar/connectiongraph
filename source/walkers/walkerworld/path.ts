import { Junction } from "./junction";
import { WorldObject } from "../../world/worldobject";
import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
import { Drawable } from "../../display/drawable";


export class Path extends WorldObject {

    private _startJunction: Junction;    
	private _endJunction: Junction;
	private _pathWorldObject:WorldObject;
    
    public constructor(startJunction:Junction,endJunction:Junction,pathWorldObject:WorldObject)  {
		 super(Path.getPathId(startJunction,endJunction));
		 this.pathWorldObject = pathWorldObject;
         this.startJunction = startJunction;
         this.endJunction = endJunction;
	}
	
	public static getPathId(startJunction:Junction,endJunction:Junction):WorldId{
		return(new WorldId(startJunction.worldId.id+":"+endJunction.worldId.id));
	}

	public get startJunction(): Junction {
		return this._startJunction;
	}

	public set startJunction(value: Junction) {
		this._startJunction = value;
	}

	public get endJunction(): Junction {
		return this._endJunction;
	}

	public set endJunction(value: Junction) {
		this._endJunction = value;
	}

	public get pathWorldObject(): WorldObject {
		return this._pathWorldObject;
	}

	public set pathWorldObject(value: WorldObject) {
		this._pathWorldObject = value;
	}


	public getWorldPosition():WorldPosition {
		return(this.pathWorldObject.getWorldPosition());
	}

	public translate(worldPosition:WorldPosition):void {
		this.pathWorldObject.translate(worldPosition);
	}


	public setWorldPosition(worldPosition:WorldPosition):void {
		this.pathWorldObject.setWorldPosition(worldPosition);
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(this.pathWorldObject.containsWorldPosition(worldPosition));
	}

	public getDrawable():Drawable {
		return(this.pathWorldObject.getDrawable());
	}

}
