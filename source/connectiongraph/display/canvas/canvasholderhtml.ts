import { CanvasHolder } from "./canvasholder";
import { World } from "../../world/world";
import { CanvasMouse } from "./canvasmouse";
import { MouseEventHandlerWorldObject } from "./mouseeventhandlerworldobject";
import { WorldDisplay } from "../worlddisplay";


export class CanvasHolderHTML implements CanvasHolder
{
	private _isVisable!:boolean;
	private _isDrawable!:boolean;
	private _canvasName!:string;
	private _canvas!:HTMLCanvasElement;
	private _context!:CanvasRenderingContext2D;
	private _canvasMouse!:CanvasMouse;
	/** Drawing size in CSS pixels; everything in the world is laid out in these units. */
	private logicalWidth:number;
	private logicalHeight:number;
	/** Backing-store pixels per CSS pixel (2-3 on Retina screens and phones when hiDpi is on). */
	private pixelRatio:number;

	/**
	 * @param options.hiDpi draw at the screen's full pixel density so lines and
	 *        text stay sharp on high-resolution displays
	 */
	constructor(canvas:string|HTMLCanvasElement,world:World,options:{hiDpi?:boolean} = {})
	{
		this.canvas = typeof canvas === "string" ? <HTMLCanvasElement>document.getElementById(canvas) : canvas;
		// remember the canvas's designed size the first time we see it, so
		// re-creating the holder (or a resized backing store) doesn't change it
		const c = this.canvas;
		if(!c.dataset.logicalWidth) {
			c.dataset.logicalWidth = String(c.width);
			c.dataset.logicalHeight = String(c.height);
		}
		this.logicalWidth = Number(c.dataset.logicalWidth);
		this.logicalHeight = Number(c.dataset.logicalHeight);
		this.pixelRatio = options.hiDpi ? Math.min(3, Math.max(1, window.devicePixelRatio || 1)) : 1;
		const backingWidth = Math.round(this.logicalWidth*this.pixelRatio);
		const backingHeight = Math.round(this.logicalHeight*this.pixelRatio);
		if(c.width!==backingWidth || c.height!==backingHeight) {
			c.width = backingWidth;
			c.height = backingHeight;
		}
		c.style.width = this.logicalWidth+"px";
		this.canvasName = this.canvas.id;
		this.isVisable = true;
		this.isDrawable = true;
		// Without hiDpi this is used by scenes whose text boxes read pixels back
		// (getImageData), which the browser handles better when told up front.
		const context = this.canvas.getContext("2d", options.hiDpi ? undefined : { willReadFrequently: true });
		if(!context) throw new Error("CanvasHolderHTML: 2d context unavailable");
		this.context = context;
		this.canvasMouse = new CanvasMouse(world,this,new MouseEventHandlerWorldObject());
		/*if (typeof document !== 'undefined')
		{
			this.canvas = document.getElementById(this.canvasName);			
			this.context = this.canvas.getContext('2d');
		}*/
	}

	public dispose():void {
		this.canvasMouse.dispose();
	}

	public clearCanvas():void {
		if(this.isVisable && this.isDrawable)
		{
			this.context.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);
			this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
			this.context.fillStyle = WorldDisplay.getColorFromString("ffffff"+"ff");
			this.context.fillRect(0, 0, this.getWidth(), this.getHeight());
		}
	}

	public getCanvas():HTMLCanvasElement {
		return(this.canvas);
	}

	public getContext():CanvasRenderingContext2D {
		return(this.context);
	}
	
	public getWidth():number
	{
		return(this.logicalWidth);
	}
	
	public getHeight():number
	{
		return(this.logicalHeight);
	}

	public isCanvasVisable(): boolean {
		return this._isVisable;
	}

	public isCanvasDrawable(): boolean {
		return this._isDrawable;
	}

	public get canvasName(): string {
		return this._canvasName;
	}

	public set canvasName(value: string) {
		this._canvasName = value;
	}


	public get canvas(): HTMLCanvasElement {
		return this._canvas;
	}

	public set canvas(value: HTMLCanvasElement) {
		this._canvas = value;
	}

	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public set context(value: CanvasRenderingContext2D) {
		this._context = value;
	}

	public get isVisable(): boolean {
		return this._isVisable;
	}

	public set isVisable(value: boolean) {
		this._isVisable = value;
	}

	public get isDrawable(): boolean {
		return this._isDrawable;
	}

	public set isDrawable(value: boolean) {
		this._isDrawable = value;
	}

	public get canvasMouse(): CanvasMouse {
		return this._canvasMouse;
	}

	public set canvasMouse(value: CanvasMouse) {
		this._canvasMouse = value;
	}
	
	
}













	/*
	static createCanvasHolderFromClientJson(worldDef,json)
	{
	  var canvasHolder = new CanvasHolder(json.canavsName,worldDef);
	  return(canvasHolder);
	}
	*/
	/*
	  getClientJson()
	  {
		  var json = {};
		  
		  
		  json.canvasName = this.canvasName;
		  json.origin = this.origin;
		  json.width = this.getWidth();
		  json.height = this.getHeight();
		  json.worldDef = this.worldDef;
		  
		  JSON.stringify(json);
		  return(json)
	  }
	*/

	/*  
	getConnector(connectorDefKey,name)
	{
		var connector = this.getConnectorDef(connectorDefKey)(this.worldDef,name);
		connector.connectorDefKey = connectorDefKey;
		return(connector);
	}
	*/

	/*
	getConnectorDef(connectorDefKey)
	{
		var connectorDef = this.worldDef.worldDisplay.connectorDefs["generic"];
		
		var foundConnectorDef = false;
		if(this.worldDef.worldDisplay.connectorDefs.hasOwnProperty(connectorDefKey))
		{
			connectorDef = this.worldDef.worldDisplay.connectorDefs[connectorDefKey];
			foundConnectorDef = true;
		}
		if(!foundConnectorDef) console.trace("CanvasHolder:getConnectorDef:connectorDefKey=\""+connectorDefKey+ "\" was not found using generic");
		connectorDef.connectorDefKey = connectorDefKey;
		return(connectorDef);
	}
	*/

	/*
	getConnectorDisplay(connectorDisplayKey)
	{
		var connectorDisplay = this.worldDef.worldDisplay.connectorDisplay["generic"];
		
		var foundConnectorDisplay = false;
		if(this.worldDef.worldDisplay.connectorDisplay.hasOwnProperty(connectorDisplayKey))
		{
			connectorDisplay = this.worldDef.worldDisplay.connectorDisplay[connectorDisplayKey];
			foundConnectorDisplay = true;
		}
		if(!foundConnectorDisplay) console.trace("CanvasHolder:getConnectorDisplay:connectorDisplayKey=\""+connectorDisplayKey+ "\" was not found using generic");
		connectorDisplay.connectorDisplayKey = connectorDisplayKey;
		return(connectorDisplay);
	}
	*/

	/*
	getGraphData(graphDataKey)
	{
		var graphData = this.worldDef.worldDisplay.nodeDisplay["generic"];	
		var foundGraphData = false;
		if(this.worldDef.worldDisplay.nodeDisplay.hasOwnProperty(graphDataKey))
		{
			graphData = this.worldDef.worldDisplay.nodeDisplay[graphDataKey];
			foundGraphData = true;
		}
		if(!foundGraphData) console.trace("CanvasHolder:getGraphData:graphDataKey=\""+graphDataKey+ "\" was not found using generic")
		//console.trace("CanvasHolder:getGraphData:graphDataKey=\""+graphDataKey+ "\" was not found using generic")
		//console.log("FOR:"+graphDataKey+Common.toString(graphData));
		//console.log("getGraphData:graphDataKey="+graphDataKey+":clone="+graphData.nodeDisplay.displayInfo.clone);

		//if(graphData.nodeDisplay.displayInfo.clone)
		if(graphData.nodeDisplayFunction)
		{
			//console.log("getGraphData:graphDataKey:FOUND A FUNCTION:"+graphDataKey);
			graphData = Object.create(graphData);
			graphData.nodeDisplay = graphData.nodeDisplayFunction();
			//console.log("CLONING:"+graphDataKey+Common.toString(graphData));
			//graphData.nodeDisplay.displayInfo = Object.create(graphData.nodeDisplay.displayInfo);
			//graphData.nodeDisplay.displayInfo  = JSON.parse(JSON.stringify(graphData.nodeDisplay.displayInfo));
			//graphData.nodeDisplay.displayInfo  = JSON.parse(JSON.stringify(graphData.nodeDisplay.displayInfo));
			//graphData = Object.create(graphData);
			//graphData.nodeDisplay.displayInfo.ts = new Date().getTime();


		}

		graphData.graphDataKey = graphDataKey;
		return(graphData);
	}
	*/
	/*
	clone(origin)
	{
		var canvasHolder = new CanvasHolderHTML(this.canvasName);
		//canvasHolder.origin = origin;
		
		var canvasHolder = new Object();
		canvasHolder.origin = origin;
		
		canvasHolder.canvasName = this.canvasName;
		canvasHolder.canvas = this.canvas;
		canvasHolder.context = this.context;
		canvasHolder.isCanvasVisable = this.isCanvasVisable;
		canvasHolder.isCanvasDrawable = this.isCanvasDrawable;
		canvasHolder.isDrawable = this.isDrawable;
		canvasHolder.isVisable = this.isVisable;
		canvasHolder.getWidth = this.getWidth;
		canvasHolder.getHeight = this.getHeight;
		canvasHolder.worldDef = this.worldDef;
		canvasHolder.getGraphData = this.getGraphData;
		
		
		return(canvasHolder);
	}
	*/