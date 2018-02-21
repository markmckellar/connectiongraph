import { MouseStatus } from "./mousestatus";
import { WorldObject } from "../../world/worldobject";
import { MouseEventHandler } from "./mouseeventhandler";
import { WorldPosition } from "../../world/worldposition";
import { World } from "../../world/world";



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

    public worldObjectSelected(world:World,event:MouseEvent,wWorldObject:WorldObject):void {

    }

    public worldObjectDeselected(world:World,event:MouseEvent):void {

    }
   
    public pointerDownEvent(world:World,event:MouseEvent):void
	{
		var eventPosition:WorldPosition = new WorldPosition(event.pageX,event.pageY);
		//this.hideCurrentNodeInfo();
	
		this.mouseStatus.isDown = true;
		this.mouseStatus.startPosition = eventPosition;
		this.mouseStatus.position = eventPosition;
		if(this.currentWorldObject!=null)
		{
			this.currentWorldObject.isAnimated = true;
			this.currentWorldObject.isSelected = false;
			this.currentWorldObject = null;
		}
		
		let clickWorldObject =  world.getWorldObjectContainingPosition(eventPosition);
	
		if(clickWorldObject!=null && clickWorldObject!=this.lastWorldObject)
		{
			this.currentWorldObject = clickWorldObject;

			this.mouseStatus.startPosition = eventPosition.clone();

			this.currentWorldObject.isSelected = true;
			this.mouseStatus.clickOffset = this.currentWorldObject.getWorldPosition().getDelta(eventPosition);

			/////////////////this.mouseStatus.clickOffset = clickWorldObject.getWorldPosition().getDelta(eventPosition);
			//this.mouseEventHandler.pointerDown(this.mouseStatus);			
			this.worldObjectSelected(world,event,this.currentWorldObject);
		}
		
		if(clickWorldObject==null)
		{
			this.worldObjectDeselected(world,event);
		}
		
		if(this.lastWorldObject)
		{
			this.worldObjectDeselected(world,event);
			this.lastWorldObject.isSelected = false;
			this.lastWorldObject = null;
		}
	
    }
    
    

    public pointerMoveEvent(world:World,event:MouseEvent):void {
    
		var eventPosition = new WorldPosition(event.pageX,event.pageY);
            if(this.mouseStatus.isDown)
            {
                this.worldObjectDeselected(world,event);
        
                if(this.currentWorldObject!=null)
                {
                    this.currentWorldObject.isAnimated = false;
                    this.mouseStatus.position = eventPosition;
                    var deltaPosition = this.mouseStatus.startPosition.getDelta(eventPosition);


                          
                    let newX = this.mouseStatus.startPosition.x-
                            deltaPosition.x+
                            this.mouseStatus.clickOffset.x;
                    
                    let newY = this.mouseStatus.startPosition.y-
                            deltaPosition.y+
                            this.mouseStatus.clickOffset.y;
/*
                    
                    this.mouseStatus.node.position.setX(
                            this.mouseStatus.nodeStartPosition.getX()-
                            deltaPosition.getX()+
                            this.mouseStatus.offset.getX());
                    
                    this.mouseStatus.node.position.setY(
                            this.mouseStatus.nodeStartPosition.getY()-
                            deltaPosition.getY()+
                            this.mouseStatus.offset.getY());

                            */

                    this.currentWorldObject.setWorldPosition( new WorldPosition(newX,newY));
                    
                    /////////this.nodeCanvas.pointerMove(this.mouseStatus.node);
                    /******* *
                    if(!this.nodeMouseMovment.hasOwnProperty(this.mouseStatus.node.getNodeKey()))
                    {
                        this.nodeMouseMovment[this.mouseStatus.node.getNodeKey()] =
                        {
                                movePostionArray:new Array()
                        }
                    }
                    this.nodeMouseMovment[this.mouseStatus.node.getNodeKey()].movePostionArray.push(this.mouseStatus.node.position.clone());
                    **********/
                }
            }
            else
            {
            }
        }
            

    public pointerUpEvent(world:World,event:MouseEvent):void 	{
		if(this.currentWorldObject!=null)
		{
			///this.nodeCanvas.pointerUp(this.mouseStatus.node);
			this.currentWorldObject.isAnimated = true;
			//this.mouseStatus.node.isSelected = false;
			this.lastWorldObject = this.currentWorldObject;
	
			this.currentWorldObject = null;
		}
		this.mouseStatus.isDown = false;
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