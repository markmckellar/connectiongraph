import { WorldPosition } from "../../../world/worldposition";
import { MatterTools } from "../mattertools";

import * as Matter from "matter-js";
//import { EngineShape } from "../../shapes/engineshape";
import { Drawable } from "../../../display/drawable";
import { WorldObject } from "../../../world/worldobject";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { WorldObjectEventHandler } from "../../../world/worldobjecteventhandler";
import { World } from "../../../world/world";
import { CanvasMouse } from "../../../display/canvas/canvasmouse";
//import { worker } from "cluster";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class MatterShape  implements WorldObject //implements EngineShape
{
	private _drawable:Drawable;
	private _worldId:WorldId;
	private _isObjectAnimated:boolean;
	private _isObjectVisable:boolean;
	private _isObjectSelected:boolean;
	private _objectOptions:any;
	private _worldObjectEventHandler:WorldObjectEventHandler;


    constructor(worldId:WorldId,drawable:Drawable,options:any,matterEngine:MatterEngine) {
		this.worldId = worldId;
		this.drawable = drawable;
		this.isObjectAnimated = true;
		this.isObjectVisable = true;
		this.isObjectSelected = true;
		this.objectOptions = options;
		this.worldObjectEventHandler = this.createMouseEventHandler();
		//options["timeScale"]= 0.1;
		//options["frictionAir"]= 0.9;

		drawable.init(this,options);
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

	public getWorldObjectEventHandler():WorldObjectEventHandler {
		return(this.worldObjectEventHandler);
	}
	
	public setWorldObjectEventHandler(worldObjectEventHandler:WorldObjectEventHandler):void {
		this.worldObjectEventHandler = worldObjectEventHandler;
	}


    
	public abstract getBody():Matter.Body;

	public scaleShape(scaleX:number,scaleY:number):void {
		Matter.Body.scale(this.getBody(),scaleX,scaleY,this.getBody().position);
		
	}
	
	
	//public getWorldPosition():WorldPosition;
	//public translate(worldPosition:WorldPosition):void;
	//public setWorldPosition(worldPosition:WorldPosition):void;
	//public containsWorldPosition(worldPosition:WorldPosition):boolean;
	//public getDrawable():Drawable { return(this.drawable); }
	public isAnimated(): boolean { return(this.isObjectAnimated); }
	public isSelected(): boolean { return(this.isObjectSelected); }
	public isVisable():boolean { return(this.isObjectVisable); }
	public getWorldId(): WorldId { return(this.worldId); }
	public getOptions(): any { return(this.objectOptions); }

	public setAnimated(animated:boolean):void { this.isObjectAnimated = animated; }
	public setSelected(selected:boolean): void { this.isObjectSelected = selected; }
	public setVisable(visable:boolean):void { this.isObjectVisable = visable; }
	

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

    public getDrawable():Drawable {
        return(this.drawable);
    }


	public get drawable(): Drawable {
		return this._drawable;
	}

	public set drawable(value: Drawable) {
		this._drawable = value;
	}
	

	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
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
