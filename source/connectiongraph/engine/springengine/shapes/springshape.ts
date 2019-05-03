import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { WorldObjectEventHandler } from "../../../world/worldobjecteventhandler";
import { World } from "../../../world/world";
import { CanvasMouse } from "../../../display/canvas/canvasmouse";
import { SpringEngine } from "../springengine";
import { EngineShapeBase } from "../../shapes/engineshapebase";

export abstract class SpringShape extends EngineShapeBase implements WorldObject  
{

	private position:WorldPosition; 
	public moveList:Array<WorldPosition>;


    constructor(worldId:WorldId,drawable:Drawable,position:WorldPosition,options:any,springEngine:SpringEngine) {
		super(worldId,drawable,options);
		this.position = position;
		this.worldObjectEventHandler = this.createMouseEventHandler();	
		this.moveList = new Array<WorldPosition>();
		springEngine.addSpringShape(this);
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

}
