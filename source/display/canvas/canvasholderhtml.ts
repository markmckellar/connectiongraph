import { CanvasHolder } from "./canvasholder";
import { World } from "../../world/world";
import { CanvasMouse } from "./canvasmouse";
import { MouseEventHandlerWorldObject } from "./mouseEventhandlerworldobject";


export class CanvasHolderHTML implements CanvasHolder
{
	private _isVisable:boolean;
	private _isDrawable:boolean;
	private _canvasName:string;
	private _canvas:HTMLCanvasElement;
	private _context:CanvasRenderingContext2D;
	private _canvasMouse:CanvasMouse;
	
	constructor(canvasName:string,world:World)
	{
		this.canvasName = canvasName;
		this.isVisable = true;
		this.isDrawable = true;
		this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasName);			
		this.context = this.canvas.getContext("2d");
		this.canvasMouse = new CanvasMouse(world,this,new MouseEventHandlerWorldObject());
		/*if (typeof document !== 'undefined')
		{
			this.canvas = document.getElementById(this.canvasName);			
			this.context = this.canvas.getContext('2d');
		}*/
	}

	public getCanvas():HTMLCanvasElement {
		return(this.canvas);
	}

	public getContext():CanvasRenderingContext2D {
		return(this.context);
	}
	
	public getWidth():number
	{
		return(this.canvas.width);
	}
	
	public getHeight():number
	{
		return(this.canvas.height);
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
		else console.log("found connector display :"+connectorDefKey);
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