import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { WorldObjectEventHandler } from "../../../world/worldobjecteventhandler";
import { World } from "../../../world/world";
import { CanvasMouse } from "../../../display/canvas/canvasmouse";
import { EngineShapeBase } from "../../shapes/engineshapebase";

export abstract class MockShape extends EngineShapeBase implements WorldObject  
{
	private position:WorldPosition; 

    constructor(worldId:WorldId,drawable:Drawable,position:WorldPosition,options:any) {
		super(worldId,drawable,options);

		this.worldId = worldId;
		this.drawable = drawable;
		this.isObjectAnimated = true;
		this.isObjectVisable = true;
		this.isObjectSelected = false;
		this.isObjectSelecteable = true;
		this.drawable = drawable;
		this.position = position;
		this.worldObjectEventHandler = this.createMouseEventHandler();
	}

	public stopRotation():void {
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
   
	public scaleShape(scaleX:number,scaleY:number):void {
		console.error("scaleShape NOT IMPLMENTED");
		
	}
    public getWorldPosition():WorldPosition {
		return(this.position );
	}

	public setWorldPosition(worldPosition:WorldPosition):void {	
		this.position.setWorldPosition(worldPosition);
	}

	public translate(worldPosition:WorldPosition):void {
		this.position.translate(worldPosition);
		
	}

	public abstract containsWorldPosition(worldPosition:WorldPosition):boolean;

}
