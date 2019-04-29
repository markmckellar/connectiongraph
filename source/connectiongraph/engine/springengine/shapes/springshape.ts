import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { WorldObjectEventHandler } from "../../../world/worldobjecteventhandler";
import { World } from "../../../world/world";
import { CanvasMouse } from "../../../display/canvas/canvasmouse";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class SpringShape implements WorldObject  
{
	private _drawable:Drawable;
	private _worldId:WorldId;
	private _isObjectAnimated:boolean;
	private _isObjectVisable:boolean;
	private _isObjectSelected:boolean;
	private _objectOptions:any;
	private _worldObjectEventHandler:WorldObjectEventHandler;

	private _position:WorldPosition; 

    constructor(worldId:WorldId,drawable:Drawable,position:WorldPosition,options:any) {
		this.worldId = worldId;
		this.drawable = drawable;
		this.isObjectAnimated = true;
		this.isObjectVisable = true;
		this.isObjectSelected = false;
		this.drawable = drawable;
		this.position = position;
		this.worldObjectEventHandler = this.createMouseEventHandler();
	}

	public stopRotation():void {
		// its a mock engine, nothng to do here :)
	}


	public 	createMouseEventHandler():WorldObjectEventHandler {
		let woe:WorldObjectEventHandler = 
	   {
		   pointerDownEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {},
		   pointerMoveEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {},
		   pointerUpEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {}
	   }
	   return(woe);
   }
   public getWorldObjectEventHandler():WorldObjectEventHandler {
	return(this.worldObjectEventHandler);

   }

   public setWorldObjectEventHandler(worldObjectEventHandler:WorldObjectEventHandler):void {
	this.worldObjectEventHandler = worldObjectEventHandler;
	}
	
	public isAnimated(): boolean { return(this.isObjectAnimated); }
	public isSelected(): boolean { return(this.isObjectSelected); }
	public isVisable():boolean { return(this.isObjectVisable); }
	public getWorldId(): WorldId { return(this.worldId); }
	public getOptions(): any { return(this.objectOptions); }

	public setAnimated(animated:boolean):void { this.isObjectAnimated = animated; }
	public setSelected(selected:boolean): void { this.isObjectSelected = selected; }
	public setVisable(visable:boolean):void { this.isObjectVisable = visable; }
	
	public scaleShape(scaleX:number,scaleY:number):void {
		console.error("scaleShape NOT IMPLMENTED");
		
	}
    public getWorldPosition():WorldPosition {
		return(this.position );
	}

	public setWorldPosition(worldPosition:WorldPosition):void {
		//this.position.x = worldPosition.x;
		//this.position.y = worldPosition.y;
		this.position.setWorldPosition(worldPosition);
	}

	public translate(worldPosition:WorldPosition):void {
		//this.position.x = worldPosition.x;
		//this.position.y = worldPosition.y;
		this.position.translate(worldPosition);
		
	}

    /**
     * Getter worldObjectEventHandler
     * @return {WorldObjectEventHandler}
     */
	public get worldObjectEventHandler(): WorldObjectEventHandler {
		return this._worldObjectEventHandler;
	}

    /**
     * Setter worldObjectEventHandler
     * @param {WorldObjectEventHandler} value
     */
	public set worldObjectEventHandler(value: WorldObjectEventHandler) {
		this._worldObjectEventHandler = value;
	}

	public abstract containsWorldPosition(worldPosition:WorldPosition):boolean;

    public getDrawable():Drawable {
        return(this.drawable);
    }


	public get drawable(): Drawable {
		return this._drawable;
	}

	public set drawable(value: Drawable) {
		this._drawable = value;
	}
    

	public get position(): WorldPosition {
		return this._position;
	}

	public set position(value: WorldPosition) {
		this._position = value;
	}

	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}

	public get isObjectAnimated(): boolean {
		return this._isObjectAnimated;
	}

	public set isObjectAnimated(value: boolean) {
		this._isObjectAnimated = value;
	}

	public get isObjectVisable(): boolean {
		return this._isObjectVisable;
	}

	public set isObjectVisable(value: boolean) {
		this._isObjectVisable = value;
	}

	public get isObjectSelected(): boolean {
		return this._isObjectSelected;
	}

	public set isObjectSelected(value: boolean) {
		this._isObjectSelected = value;
	}

	public get objectOptions(): any {
		return this._objectOptions;
	}

	public set objectOptions(value: any) {
		this._objectOptions = value;
	}

}
