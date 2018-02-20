import { MouseStatus } from "./mousestatus";
import { WorldPosition } from "../../world/worldposition";
import { NodeCanvas } from "./nodecanvas";
import { CanvasHolder } from "./canvasholder";
import { MouseEventHandler } from "./mouseeventhandler";


export class NodeCanvasMouse
{
	private _nodeCanvas:NodeCanvas;
	private _offset:WorldPosition;
	private _mouseStatus:MouseStatus;
	private _canvasholder:CanvasHolder;
	private _mouseEventHandler:MouseEventHandler;
	

	constructor(canvasholder:CanvasHolder,mouseEventHandler:MouseEventHandler)
	{
		this.canvasholder = canvasholder;
		this.mouseEventHandler = mouseEventHandler;
		if(canvasholder.isVisable()) 
		{
			this.offset = NodeCanvasMouse.getCanvasOffset(this.canvasholder.canvas);
			this.mouseStatus = new MouseStatus(false,new WorldPosition(0,0),new WorldPosition(0,0));
			this.initCavansPointer();
			this.nodeMouseMovment = {};
		}
	}
	
	public static getCanvasOffset(obj:HTMLCanvasElement):WorldPosition
	{
	    let offsetLeft = 0;
	    let offsetTop = 0;
	    do
	    {
	      if (!isNaN(obj.offsetLeft))
	      {
	          offsetLeft += obj.offsetLeft;
	      }
	      if (!isNaN(obj.offsetTop))
	      {
	          offsetTop += obj.offsetTop;
	      }   
	    }
	    while(obj = obj.offsetParent );
	    
	    return( new WorldPosition(offsetLeft,offsetTop) );
	}

	public pointerDownEvent(event:MouseEvent)
	{
		var eventPosition = new WorldPosition(event.pageX-this.offset.x,event.pageY-this.offset.y);
		this.hideCurrentNodeInfo();
	
		this.mouseStatus.isDown = true;
		this.mouseStatus.startPosition = eventPosition;
		this.mouseStatus.position = eventPosition;
		if(this.mouseStatus.worldObject!=null)
		{
			this.mouseStatus.worldObject.isAnimated = true;
			this.mouseStatus.worldObject.isSelected = false;
			this.mouseStatus.worldObject = null;
		}
		
		let clckWorldObject =  this.nodeCanvas.getNodeContainingPosition(eventPosition);
	
		if(clckWorldObject!=null && clckWorldObject!=this.mouseStatus.lastWorldObject)
		{
			this.mouseStatus.worldObject = clckWorldObject;
			this.mouseStatus.startPosition = clckWorldObject.worldPosition.clone();
			this.mouseStatus.worldObject.isSelected = true;
			this.mouseStatus.offset = clckWorldObject.worldPosition.getDelta(eventPosition);
			this.mouseEventHandler.pointerDown(this.mouseStatus);
			
			this.mouseEventHandler.objectedSelected(this.mouseStatus);
		}
		
		if(clckWorldObject==null)
		{
			this.mouseEventHandler.objectedDeselected(this.mouseStatus);
		}
		
		if(this.mouseStatus.lastWorldObject)
		{
			this.mouseEventHandler.objectedDeselected(this.mouseStatus);
			this.mouseStatus.lastWorldObject.isSelected = false;
			this.mouseStatus.lastWorldObject = null;
		}
	
	}
	
	/*
	showCurrentNodeInfo()
	{
		var htmlObject = document.getElementById("nodeinfo");
		if(htmlObject!=null)
		{
			htmlObject.style.left = this.mouseStatus.node.position.getX()+30+'px';
			htmlObject.style.top  = this.mouseStatus.node.position.getY()+'px';
			htmlObject.style.visibility = 'visible';
			$('#nodeinfo').html(this.mouseStatus.node.getNodeUiDisplay());
		}
		
		console.log("name:"+this.mouseStatus.node.name+"\n"+
				"	isSelected:"+this.mouseStatus.node.isSelected+"\n"+
				"	isSelected:"+this.mouseStatus.node.isAnimated+"\n"+
				"	position:"+Common.toString(this.mouseStatus.node.position)+"\n"+
				"	isSelected:"+this.mouseStatus.node.isSelected+
				"---------------------------------------------"+
			"");
	}
	*/
	/*
	hideCurrentNodeInfo()
	{
		var htmlObject = document.getElementById("nodeinfo");
		if(htmlObject!=null)
		{
			htmlObject.style.left = 0+'px';
			htmlObject.style.top  = 0+'px';
			htmlObject.style.visibility = 'hidden';
			$('#nodeinfo').html();
		}
	}
	*/
	pointerMoveEvent(event)
	{
		var eventPosition = new Position(event.pageX-this.offset.left,event.pageY-this.offset.top);
		if(this.mouseStatus.isDown)
		{
			this.hideCurrentNodeInfo();
	
			if(this.mouseStatus.node!=null)
			{
				this.mouseStatus.node.isAnimated = false;
				this.mouseStatus.position = eventPosition;
				var deltaPosition = this.mouseStatus.nodeStartPosition.getDelta(eventPosition);
				
				this.mouseStatus.node.position.setX(
						this.mouseStatus.nodeStartPosition.getX()-
						deltaPosition.getX()+
						this.mouseStatus.offset.getX());
				
				this.mouseStatus.node.position.setY(
						this.mouseStatus.nodeStartPosition.getY()-
						deltaPosition.getY()+
						this.mouseStatus.offset.getY());
				
				this.nodeCanvas.pointerMove(this.mouseStatus.node);
				
				if(!this.nodeMouseMovment.hasOwnProperty(this.mouseStatus.node.getNodeKey()))
				{
					this.nodeMouseMovment[this.mouseStatus.node.getNodeKey()] =
					{
							movePostionArray:new Array()
					}
				}
				this.nodeMouseMovment[this.mouseStatus.node.getNodeKey()].movePostionArray.push(this.mouseStatus.node.position.clone());
			}
		}
		else
		{
		}
	}
	
	pointerUpEvent(event)
	{
		if(this.mouseStatus.node!=null)
		{
			this.nodeCanvas.pointerUp(this.mouseStatus.node);
			this.mouseStatus.node.isAnimated = true;
			//this.mouseStatus.node.isSelected = false;
			this.mouseStatus.lastNode = this.mouseStatus.node;
	
			this.mouseStatus.node = null;
		}
		this.mouseStatus.isDown = false;
	}
	
	initCavansPointer()
	{
		var self = this;
		if(window.PointerEvent)
		{
			this.nodeCanvas.canvasHolder.canvas.addEventListener("pointerdown", function(event) { self.pointerDownEvent( event) }, false);
			this.nodeCanvas.canvasHolder.canvas.addEventListener("pointermove",function(event) { self.pointerMoveEvent( event) }, false);
			this.nodeCanvas.canvasHolder.canvas.addEventListener("pointerup",function(event) { self.pointerUpEvent( event) }, false);
	    }
	    else
	    {
	    	this.nodeCanvas.canvasHolder.canvas.addEventListener("mousedown",function(event) { self.pointerDownEvent( event) }, false);
	    	this.nodeCanvas.canvasHolder.canvas.addEventListener("mousemove",function(event) { self.pointerMoveEvent( event) }, false);
	    	this.nodeCanvas.canvasHolder.canvas.addEventListener("mouseup", function(event) { self.pointerUpEvent( event) }, false);
	    }  
	}


	public get mouseStatus(): MouseStatus {
		return this._mouseStatus;
	}

	public set mouseStatus(value: MouseStatus) {
		this._mouseStatus = value;
	}
	

	public get nodeCanvas(): NodeCanvas {
		return this._nodeCanvas;
	}

	public set nodeCanvas(value: NodeCanvas) {
		this._nodeCanvas = value;
	}
	

	public get canvasholder(): CanvasHolder {
		return this._canvasholder;
	}

	public set canvasholder(value: CanvasHolder) {
		this._canvasholder = value;
	}
	

	public get offset(): WorldPosition {
		return this._offset;
	}

	public set offset(value: WorldPosition) {
		this._offset = value;
	}

	public get mouseEventHandler(): MouseEventHandler {
		return this._mouseEventHandler;
	}

	public set mouseEventHandler(value: MouseEventHandler) {
		this._mouseEventHandler = value;
	}


}
