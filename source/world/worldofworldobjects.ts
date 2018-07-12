import { WorldEngine } from "../engine/worldengine";
import { WorldObject } from "./worldobject";
import { World } from "./world";
import { CanvasHolder } from "../display/canvas/canvasholder";
import { WorldPosition } from "./worldposition";
import { WorldId } from "./worldid";


export class WorldOfWorldObjects extends World{

    private _worldObjectArray:Array<WorldObject>;

    constructor(worldEngine:WorldEngine){
        super(worldEngine);
        this.worldObjectArray = new Array<WorldObject>();
	}
	
	
	public drawWorld(canvasHolder:CanvasHolder):void {
        let context = canvasHolder.getContext();
        canvasHolder.clearCanvas();
        for(let i=0;i<this.worldObjectArray.length;i++) {
            let worldObject:WorldObject = this.worldObjectArray[i];
            worldObject.getDrawable().draw(context);
        }
    }

    public addWorldObject(worldObject:WorldObject):void {
        this.worldObjectArray.push(worldObject);
    }


    public getWorldObjectMatchingWorldId(worldId:WorldId):WorldObject {
        let foundObject:WorldObject = null;
        for(let i=0;i<this.worldObjectArray.length;i++) {
            ////console.log("this.worldObjectArray.length="+this.worldObjectArray.length+":i="+i);
            let worldObject:WorldObject = this.worldObjectArray[i];
            ////console.log("    worldObject.position="+worldObject.getWorldPosition());
            if(worldObject.getWorldId().matches(worldId)) foundObject = worldObject;
        }
        return(foundObject);
    }


    public getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject {
        let foundObject:WorldObject = null;
        for(let i=0;i<this.worldObjectArray.length;i++) {
            ////console.log("this.worldObjectArray.length="+this.worldObjectArray.length+":i="+i);
            let worldObject:WorldObject = this.worldObjectArray[i];
            ////console.log("    worldObject.position="+worldObject.getWorldPosition());
            if(worldObject.containsWorldPosition(worldPosition) && worldObject!=this.worldEngine.getMouseAnchor()) foundObject = worldObject;
        }
        return(foundObject);
    }

    /**
     * Getter worldObjectArray
     * @return {Array<WorldObject>}
     */
	public get worldObjectArray(): Array<WorldObject> {
		return this._worldObjectArray;
	}

    /**
     * Setter worldObjectArray
     * @param {Array<WorldObject>} value
     */
	public set worldObjectArray(value: Array<WorldObject>) {
		this._worldObjectArray = value;
	}
    
}