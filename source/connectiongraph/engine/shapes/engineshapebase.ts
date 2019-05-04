import { Drawable } from "../../display/drawable";
import { WorldId } from "../../world/worldid";
import { WorldObjectEventHandler } from "../../world/worldobjecteventhandler";
import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";
 
export abstract class EngineShapeBase implements EngineShape {
	public drawable:Drawable;
	public worldId:WorldId;
	public isObjectAnimated:boolean;
	public isObjectVisable:boolean;
	public isObjectSelected:boolean;
	public objectOptions:any;
	public worldObjectEventHandler:WorldObjectEventHandler;
    public isObjectSelecteable:boolean;
    private collisionTags:Array<string>;
	public static WorldStructureCollisionTag = "WorldStructureCollisionTag";
    
    constructor(worldId:WorldId,drawable:Drawable,options:any) {
		this.worldId = worldId;
		this.drawable = drawable;
		this.isObjectAnimated = true;
		this.isObjectVisable = true;
		this.isObjectSelected = false;
		this.isObjectSelecteable = true;
		this.objectOptions = options;
        this.worldObjectEventHandler = this.createMouseEventHandler();
        this.collisionTags = new Array<string>();
		drawable.init(this,options);
    }
/*
    public checkCollissionTags(otherShape:EngineShape) {
        return( EngineShapeBase.checkCollissionTagSets(this.collisionTags,otherShape.collisionTags));
	}
*/	
	public static checkCollissionTagSetsx(o1:Set<string>,o2:Set<string>) {
		let sharesTags = false;
		if(!o1)
        o1.forEach(function(item){
            if(o2.has(item)) sharesTags = true;
        });
        return(sharesTags);
	}
	// collisionTags

	public getWorldStructureCollisionTag():string {
		return(EngineShapeBase.WorldStructureCollisionTag);
	}
	public static  checkCollissionTags(filterA:any, filterB:any):boolean {
		if(!filterA.collisionTags || !filterB.collisionTags){
			return(false);
		}
		if(filterA.collisionTags.includes(EngineShapeBase.WorldStructureCollisionTag))
			return(true);
		if(filterB.collisionTags.includes(EngineShapeBase.WorldStructureCollisionTag))
			return(true)
		for(var i=0;i<filterB.collisionTags.length;i++)
		{
		  if(filterA.collisionTags.includes(filterB.collisionTags[i]))
			 return(true);
		}
		for(var i=0;i<filterA.collisionTags.length;i++)
		{
		  if(filterB.collisionTags.includes(filterA.collisionTags[i]))
			 return(true);
		}
		//document.getElementById("messages").innerHTML = message;

	   return(false);
	  }
	public  getCollisionTagList():Array<string> {
		return(this.collisionTags);

	}


	public addToCollissionTags(tagName:string) {
        this.collisionTags.push(tagName);
        //engineShape.collisionTags.push(this.areaEngineShape.getWorldId().id);
    }
    public removeFromCollisionTags(tagName:string) {
        let index = this.collisionTags.indexOf(tagName, 0);
        if (index > -1)  this.collisionTags.splice(index, 1);
        //engineShape.collisionTags.push(this.areaEngineShape.getWorldId().id);
    }  

    public abstract createMouseEventHandler():WorldObjectEventHandler;
    public abstract scaleShape(scaleX:number,scaleY:number):void;
	public abstract getShapePoints():Array<WorldPosition>;
    public abstract getWorldPosition():WorldPosition;
	public abstract translate(worldPosition:WorldPosition):void;	
	public abstract setWorldPosition(worldPosition:WorldPosition):void;	
	public abstract containsWorldPosition(worldPosition:WorldPosition):boolean ;	
	

	public isAnimated(): boolean { return(this.isObjectAnimated); }
	public isSelected(): boolean { return(this.isObjectSelected); }
	public isVisable():boolean { return(this.isObjectVisable); }
	public getWorldId(): WorldId { return(this.worldId); }
	public getOptions(): any { return(this.objectOptions); }
	public isSelectable(): boolean { return(this.isObjectSelecteable); }
	
	public setSelectable(selectable:boolean): void { this.isObjectSelecteable = selectable; }
	public setAnimated(animated:boolean):void { this.isObjectAnimated = animated; }
	public setSelected(selected:boolean): void { this.isObjectSelected = selected; }
    public setVisable(visable:boolean):void { this.isObjectVisable = visable; }
    
    public getDrawable():Drawable {
        return(this.drawable);
    }

    public getWorldObjectEventHandler():WorldObjectEventHandler {
		return(this.worldObjectEventHandler);
	}
	
	public setWorldObjectEventHandler(worldObjectEventHandler:WorldObjectEventHandler):void {
		this.worldObjectEventHandler = worldObjectEventHandler;
	}
	public abstract stopRotation():void;


}