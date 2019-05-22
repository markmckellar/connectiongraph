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
        this.worldEngine.worldEngineParams.updateFunction(this);
        //this.worldEngine.getMouseAnchor().getWorldPosition().x;
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

    /**
     * Finds the world object which has a body which the passed in postion "selects" ()
     * 
     * That bit above... complelty wrong!!! Its not that simple. What if more than one object
     * is selected by the position?  Are the objects layered??!?  Are some not selectable?
     * ..what does "selectable" even mean?
     * 
     * The first solution that comes to mind is this function should return an array of objects
     * that are selected.  This function then figures out waht that means....
     * 
     * It seems the function should return an array of objects selected with the order of the array
     * being the first eligable to be selected goes first (and so on)
     * 
     * What does eligable-to-be-selcted mean?  Is it usueful to have this definition somewhat fluid?
     * 
     * maybe every object created should have a lsit of selectable tags....
     * ...kind of like colision tags
     * and a click also has a list of list of selectable...
     * ...the intersection is the list returned
     * ..a slectable tag should also have a "sort" value...
     * ..and the final list will be ordred by this value
     * ...if something specific needs to be done this should add tons of elxibility
     * 
     * selectable interace
     * ---list of tags

     * 
     * worldobject has a :
     * ---selectable 
     * 
     * moust click has a :
     * ---selectable
     * 
     * so sorting is harder than I thought to :/
     * 
     * because what if you want to sort diffrent depending on ho is in the list? (and waht are there tags?)
     * 
     * .. the WROLD should know how to sort them...
     * ..its rsponsible!
     * 
     * So :
     *  world has a 
     * ---sortWorldObjectList 
     * --------a world postion that produces a list of world objects for selection
     * --------a list of world objects which were slected for by some list of tags
     * --------a list of the selectable tags that prodiced the fore menioned list of world objects
     * 
     * 
    */
    public getWorldObjectContainingPosition(worldPosition:WorldPosition):WorldObject {
        let foundObject:WorldObject = null;
        for(let i=0;i<this.worldObjectArray.length;i++) {
            ////console.log("this.worldObjectArray.length="+this.worldObjectArray.length+":i="+i);
            let worldObject:WorldObject = this.worldObjectArray[i];
            ////console.log("    worldObject.position="+worldObject.getWorldPosition());
            if(worldObject.isSelectable())
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