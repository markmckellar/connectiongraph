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
    public collisionTags:Set<string>;

    
    constructor(worldId:WorldId,drawable:Drawable,options:any) {
		this.worldId = worldId;
		this.drawable = drawable;
		this.isObjectAnimated = true;
		this.isObjectVisable = true;
		this.isObjectSelected = false;
		this.isObjectSelecteable = true;
		this.objectOptions = options;
        this.worldObjectEventHandler = this.createMouseEventHandler();
        this.collisionTags = new Set<string>();
		drawable.init(this,options);
    }

    public checkCollissionTags(otherShape:EngineShape) {
        let sharesTags = false;
        let self = this;
        this.collisionTags.forEach(function(item){
            if(otherShape.collisionTags.has(item)) sharesTags = true;
        });

        return(sharesTags);
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