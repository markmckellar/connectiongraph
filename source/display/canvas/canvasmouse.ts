import { WorldPosition } from "../../world/worldposition";
import { CanvasHolderHTML } from "./canvasholderhtml";
import { MouseEventHandler } from "./mouseeventhandler";
import { World } from "../../world/world";


export class CanvasMouse
{
	private _offset:WorldPosition;
	private canvasholderHTML:CanvasHolderHTML;
	private _mouseEventHandler:MouseEventHandler;
	

	constructor(world:World,canvasholderHTML:CanvasHolderHTML,mouseEventHandler:MouseEventHandler)
	{
		this.canvasholderHTML = canvasholderHTML;
		this.mouseEventHandler = mouseEventHandler;
		if(canvasholderHTML.isCanvasVisable()) 
		{
			//this.offset = NodeCanvasMouse.getCanvasOffset(this.canvasholder.canvas);
			this.offset = this.getCanvasOffset();		
			var self = this;
			this.canvasholderHTML.canvas.addEventListener("pointerdown", function(event) { self.pointerDownEvent(world,event) }, false);
			this.canvasholderHTML.canvas.addEventListener("pointermove",function(event) { self.pointerMoveEvent(world,event) }, false);
			this.canvasholderHTML.canvas.addEventListener("pointerup",function(event) { self.pointerUpEvent(world,event) }, false);
			//this.nodeMouseMovment = {};
		}
	}

	private getCanvasOffset():WorldPosition
	{
	    let offsetLeft = 0;
		let offsetTop = 0;
		let object:HTMLElement = this.canvasholderHTML.canvas;
	    do
	    {
	      if (!isNaN(object.offsetLeft))
	      {
	          offsetLeft += object.offsetLeft;
	      }
	      if (!isNaN(object.offsetTop))
	      {
	          offsetTop += object.offsetTop;
		  }   
		 let element:any = object.offsetParent;
		 if(element.hasOwnProperty("offsetParent")) object = element;
		 else object = null;
	    }
	    while(object);
	    
	    return( new WorldPosition(offsetLeft,offsetTop) );
	}

	public pointerDownEvent(world:World,event:MouseEvent) {
		this.mouseEventHandler.pointerDownEvent(world,event);
	}
	
	public pointerMoveEvent(world:World,event:MouseEvent)	{
		this.mouseEventHandler.pointerMoveEvent(world,event);

	}
	
	public pointerUpEvent(world:World,event:MouseEvent)
	{
		this.mouseEventHandler.pointerUpEvent(world,event);

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


	public get $canvasholderHTML(): CanvasHolderHTML {
		return this.canvasholderHTML;
	}

	public set $canvasholderHTML(value: CanvasHolderHTML) {
		this.canvasholderHTML = value;
	}
	

}
