import { WorldPosition } from "../../world/worldposition";
import { CanvasHolderHTML } from "./canvasholderhtml";
import { MouseEventHandler } from "./mouseeventhandler";
import { World } from "../../world/world";


export class CanvasMouse
{
	private canvasholderHTML:CanvasHolderHTML;
	private _mouseEventHandler!:MouseEventHandler;
	

	private listeners:Array<[string,(e:PointerEvent)=>void]> = [];

	constructor(world:World,canvasholderHTML:CanvasHolderHTML,mouseEventHandler:MouseEventHandler,listen:boolean = true)
	{
		this.canvasholderHTML = canvasholderHTML;
		this.mouseEventHandler = mouseEventHandler;
		if(listen && canvasholderHTML.isCanvasVisable())
		{
			this.listeners = [
				["pointerdown",(event) => this.pointerDownEvent(world,this,event)],
				["pointermove",(event) => this.pointerMoveEvent(world,this,event)],
				["pointerup",(event) => this.pointerUpEvent(world,this,event)],
			];
			for(const [type,fn] of this.listeners)
				this.canvasholderHTML.canvas.addEventListener(type,fn as EventListener,false);
		}
	}

	/** Remove the pointer listeners so a re-run doesn't stack handlers on the same canvas. */
	public dispose():void {
		for(const [type,fn] of this.listeners)
			this.canvasholderHTML.canvas.removeEventListener(type,fn as EventListener,false);
		this.listeners = [];
	}

	/** Page-space position of the canvas's top-left corner (computed live, so scrolling/layout changes are fine). */
	private getCanvasOffset():WorldPosition
	{
		const rect = this.canvasholderHTML.canvas.getBoundingClientRect();
		return( new WorldPosition(rect.left + window.scrollX, rect.top + window.scrollY) );
	}


	public pointerDownEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent) {
		// only the primary button drags; leave right-click free for context menus
		if((event as PointerEvent).button!==0) return;
		event.preventDefault();
		this.mouseEventHandler.pointerDownEvent(world,canvasMouse,event);
	}
	
	public pointerMoveEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent)	{
		event.preventDefault();
		this.mouseEventHandler.pointerMoveEvent(world,canvasMouse,event);
	}
	
	public pointerUpEvent(world:World,canvasMouse:CanvasMouse,event:UIEvent)
	{
		event.preventDefault();
		this.mouseEventHandler.pointerUpEvent(world,canvasMouse,event);
	}
	

	
	/**
	 * Where an event happened, in world coordinates. Accounts for the canvas
	 * being scrolled, for it being drawn smaller or larger than its pixel size
	 * (e.g. shrunk to fit a phone screen), and for the holder's pan and zoom.
	 */
	public toCanvasPosition(event:{clientX:number,clientY:number}):WorldPosition {
		const holder = this.canvasholderHTML;
		const r = holder.canvas.getBoundingClientRect();
		const w = holder.toWorld(
			(event.clientX - r.left) * holder.getWidth() / (r.width || holder.getWidth()),
			(event.clientY - r.top) * holder.getHeight() / (r.height || holder.getHeight()));
		return new WorldPosition(w.x, w.y);
	}

	public get offset(): WorldPosition {
		return this.getCanvasOffset();
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
