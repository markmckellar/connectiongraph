import { WorldPosition } from "../../../world/worldposition";
import { MatterTools } from "../mattertools";
import * as Matter from "matter-js";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { WorldObjectEventHandler } from "../../../world/worldobjecteventhandler";
import { World } from "../../../world/world";
import { CanvasMouse } from "../../../display/canvas/canvasmouse";
import { EngineShapeBase } from "../../shapes/engineshapebase";


export abstract class MatterShape  extends EngineShapeBase implements WorldObject //implements EngineShape
{
    constructor(worldId:WorldId,drawable:Drawable,options:any,matterEngine:MatterEngine) {
		super(worldId,drawable,options);
		options['collisionFilter'] = this.getCollisionFilter();

	}

	public stopRotation():void {
		Matter.Body.setAngularVelocity(this.getBody(),0);
		Matter.Body.setAngle(this.getBody(),0);
		//Matter.Body.setInertia(rectangle.getBody(),Infinity);
	    //Matter.Body.setStatic(rectangle.getBody(),true);
	}

	public 	createMouseEventHandler():WorldObjectEventHandler {
	 	let woe:WorldObjectEventHandler = 
		{
			pointerDownEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {console.log("ZZZZZZZZZZ HAHA  HEY FELLA XXXXXXX")},
			pointerMoveEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {},
			pointerUpEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {}
		}
		return(woe);
	}
	public abstract getBody():Matter.Body;

	public getCollisionFilter() {
		let collisionFilter = {
			collisionTags:this.getCollisionTagList(),
			group:1,
			collidesWith:[-1]
		};
		return(collisionFilter);
	}
	
	public scaleShape(scaleX:number,scaleY:number):void {
		Matter.Body.scale(this.getBody(),scaleX,scaleY,this.getBody().position);
		
	}

	public getShapePoints():Array<WorldPosition> {
        return( MatterTools.getWorldPostionArrayFromVectorArray(this.getBody().vertices) );     
    }
	
    public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition( this.getBody() ) );
	}

	public translate(worldPosition:WorldPosition):void {
		let newX = worldPosition.x-this.getBody().position.x;
		let newY = worldPosition.y-this.getBody().position.y;

		Matter.Body.translate( this.getBody(),Matter.Vector.create(
			newX,newY ));
	}
	
	public setWorldPosition(worldPosition:WorldPosition):void {
		let newX = worldPosition.x-this.getBody().position.x;
		let newY = worldPosition.y-this.getBody().position.y;

		Matter.Body.translate( this.getBody(),Matter.Vector.create(
			newX,newY ));
	}
	
	public containsWorldPosition(worldPosition:WorldPosition):boolean {

		return( Matter.Vertices.contains( this. getBody().vertices, MatterTools.getVectorFromWorldPostion(worldPosition)) );
	}
}
