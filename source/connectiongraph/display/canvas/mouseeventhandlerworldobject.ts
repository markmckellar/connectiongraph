import { MouseStatus } from "./mousestatus";
import { WorldObject } from "../../world/worldobject";
import { MouseEventHandler } from "./mouseeventhandler";
import { WorldPosition } from "../../world/worldposition";
import { World } from "../../world/world";
import { CanvasMouse } from "./canvasmouse";
import { WorldDisplay } from "../worlddisplay";



export class MouseEventHandlerWorldObject implements MouseEventHandler {
   private _mouseStatus:MouseStatus;
   private _currentWorldObject:WorldObject;
   private _lastWorldObject:WorldObject;

    constructor()
    {
        this.mouseStatus = new MouseStatus();
        this.currentWorldObject = null;
        this.lastWorldObject = null;
	}
	
	public getMouseStatus():MouseStatus {
		return(this.mouseStatus);
	}

    public worldObjectSelected(world:World,event:MouseEvent,wWorldObject:WorldObject):void {

    }

    public worldObjectDeselected(world:World,event:MouseEvent):void {

	}

	public getCurrentWorldObject():WorldObject {
		return(this.currentWorldObject);
	}
	
	/*
	public getWorldPositionFromMouseEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):WorldPosition {
		var eventPosition:WorldPosition = new WorldPosition(event.pageX-canvasMouse.offset.x,event.pageY-canvasMouse.offset.y);
		return(eventPosition);
	}
	*/
   
    public pointerDownEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void
	{
		//console.log("pointerDownEvent:"+JSON.stringify(event));;
		var eventPosition:WorldPosition = WorldDisplay.getWorldPositionFromMouseEvent(world,canvasMouse,event);
		//this.hideCurrentNodeInfo();
		console.log("pointerDownEvent:"+JSON.stringify(eventPosition));;

		this.mouseStatus.isDown = true;
		this.mouseStatus.startPosition = eventPosition;
		this.mouseStatus.position = eventPosition;
		if(this.currentWorldObject!=null)
		{
			this.currentWorldObject.setAnimated(true);
			this.currentWorldObject.setSelected(false);
			this.currentWorldObject = null;
		}
		
		let clickWorldObject:WorldObject =  world.getWorldObjectContainingPosition(eventPosition);
	
		if(clickWorldObject!=null && clickWorldObject!=this.lastWorldObject)
		{
			console.log("pointerDownEvent:clickWorldObject="+clickWorldObject.getWorldId().id);

			this.currentWorldObject = clickWorldObject;

			this.mouseStatus.startPosition = eventPosition.clone();

			this.currentWorldObject.setSelected(true);
			this.mouseStatus.clickOffset = this.currentWorldObject.getWorldPosition().getDelta(eventPosition);
			this.currentWorldObject.setAnimated(false);
			/////////////////this.mouseStatus.clickOffset = clickWorldObject.getWorldPosition().getDelta(eventPosition);
			//this.mouseEventHandler.pointerDown(this.mouseStatus);			
			this.worldObjectSelected(world,event,this.currentWorldObject);	
			this.currentWorldObject.getWorldObjectEventHandler().pointerDownEvent(world,canvasMouse,event);		
		}
		
		if(clickWorldObject==null)
		{
			this.worldObjectDeselected(world,event);
		}
		
		if(this.lastWorldObject)
		{
			this.worldObjectDeselected(world,event);
			this.lastWorldObject.setSelected(false);
			this.lastWorldObject = null;
		}

		world.worldEngine.pointerDownEngineEvent(world,canvasMouse,event,this);
		////////////this.updateObjectPosition(eventPosition);

		
		
	
	}
/*
	private updateObjectPosition():void {

		if(this.currentWorldObject!=null)
		{
			this.currentWorldObject.setAnimated(false);
			this.mouseStatus.position = this.mouseStatus.position;;
			var deltaPosition = this.mouseStatus.startPosition.getDelta(this.mouseStatus.position);


					
			let newX = this.mouseStatus.startPosition.x-
					deltaPosition.x+
					this.mouseStatus.clickOffset.x;
			
			let newY = this.mouseStatus.startPosition.y-
					deltaPosition.y+
					this.mouseStatus.clickOffset.y;

			this.currentWorldObject.setWorldPosition( new WorldPosition(newX,newY));
		}
	}
  */  
    

    public pointerMoveEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {
		var eventPosition:WorldPosition = WorldDisplay.getWorldPositionFromMouseEvent(world,canvasMouse,event);
		this.mouseStatus.position = eventPosition;
		
		if(this.mouseStatus.isDown)
		{
			//var eventPosition:WorldPosition = WorldDisplay.getWorldPositionFromMouseEvent(world,canvasMouse,event);
			//this.mouseStatus.position = eventPosition;
			
			////////////console.log("pointerMoveEvent:"+event);

			this.worldObjectDeselected(world,event);
			if(this.currentWorldObject!=null)
			{
				this.currentWorldObject.setAnimated(false);
				this.currentWorldObject.getWorldObjectEventHandler().pointerMoveEvent(world,canvasMouse,event);		

			}
			this.mouseStatus.position = this.mouseStatus.position;;
			


			//this.updateObjectPosition(eventPosition);
			/*
			if(this.currentWorldObject!=null)
			{
				this.currentWorldObject.setAnimated(false);
				this.mouseStatus.position = eventPosition;
				var deltaPosition = this.mouseStatus.startPosition.getDelta(eventPosition);


						
				let newX = this.mouseStatus.startPosition.x-
						deltaPosition.x+
						this.mouseStatus.clickOffset.x;
				
				let newY = this.mouseStatus.startPosition.y-
						deltaPosition.y+
						this.mouseStatus.clickOffset.y;

				this.currentWorldObject.setWorldPosition( new WorldPosition(newX,newY));
			}
			*/
		}
		world.worldEngine.pointerMoveEngineEvent(world,canvasMouse,event,this);
    }
            

    public pointerUpEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):void 	{
		//console.log("pointerUpEvent:"+JSON.stringify(event));
		//var eventPosition:WorldPosition = this.getWorldPositionFromMouseEvent(world,canvasMouse,event);
		var eventPosition:WorldPosition = WorldDisplay.getWorldPositionFromMouseEvent(world,canvasMouse,event);
		this.mouseStatus.position = eventPosition;
		
		if(this.currentWorldObject!=null)
		{
			///this.nodeCanvas.pointerUp(this.mouseStatus.node);
			this.currentWorldObject.setAnimated(true);
			//this.mouseStatus.node.isSelected = false;
			this.lastWorldObject = this.currentWorldObject;
	
			this.currentWorldObject.getWorldObjectEventHandler().pointerUpEvent(world,canvasMouse,event);		

			this.currentWorldObject = null;
		}
		this.mouseStatus.isDown = false;
		world.worldEngine.pointerUpEngineEvent(world,canvasMouse,event,this);
		
	}

	public get mouseStatus(): MouseStatus {
		return this._mouseStatus;
	}

	public set mouseStatus(value: MouseStatus) {
		this._mouseStatus = value;
	}


	public get currentWorldObject(): WorldObject {
		return this._currentWorldObject;
	}

	public set currentWorldObject(value: WorldObject) {
		this._currentWorldObject = value;
	}


	public get lastWorldObject(): WorldObject {
		return this._lastWorldObject;
	}

	public set lastWorldObject(value: WorldObject) {
		this._lastWorldObject = value;
	}
    
}