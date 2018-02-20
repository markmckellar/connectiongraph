import { WorldPosition } from "../../world/worldposition";
import { WorldObject } from "../../world/worldobject";
import { CanvasHolder } from "./canvasholder";


export abstract class NodeCanvas extends Node
{
	private canvasHolder:CanvasHolder;

	  constructor(canvasHolder)
	  {
		  super(	canvasHolder.canvasName,
					new WorldPosition(0,0),
					canvasHolder,
					"generic",
					null);
		  NodeCanvas.initNodeCanvas(this,canvasHolder);
		  
	  }

	  public abstract getNodeContainingPosition(worldPosition:WorldPosition):WorldObject;
	  
	  public static initNodeCanvas(nodeCanvas,canvasHolder)
	  {
			nodeCanvas.extraAnimation = null;
			nodeCanvas.canvasHolder = canvasHolder;
			nodeCanvas.startAnimationTimeStamp = null;
			nodeCanvas.lastAnimationTimeStamp = null;
			nodeCanvas.startAnimationDate = null;
			nodeCanvas.animationExecTime = 0;
			nodeCanvas.timeFactor = 1;
			nodeCanvas.worldUpdateQueueProcessed = new Array();

		}
	  
		public  getWorldUpdatesProcessed(timeStamp,maxItems)
		{
			var worldUpdateArray = new Array();
			var first = null;
			for(var i=0;i<this.worldUpdateQueueProcessed.length &&
				worldUpdateArray.length<maxItems;i++)
			{
				var worldUpdate = this.worldUpdateQueueProcessed[i];

				if(worldUpdate.processTimestamp>timeStamp) 
				{
					worldUpdateArray.push(worldUpdate);
					/*
					console.log("      getWorldUpdatesProcessed"+
							":worldUpdate.processTimestamp="+worldUpdate.processTimestamp+
							":readyToBeProcessed="+worldUpdate.readyToBeProcessed(timeStamp)+
							":timeStamp="+timeStamp);
					*/
				}
			}
			/*
			console.log("getWorldUpdatesProcessed"+
					":timeStamp="+timeStamp+
					":maxItems="+maxItems+
					":found="+worldUpdateArray.length);
					*/
			return(worldUpdateArray);
		}
	
		public getWorldClientJson()
	  {
		  var json = {};
		  
		  json.nodeGraph = super.getClientJson();
		  json.canvasHolder = this.canvasHolder.getClientJson();
		  JSON.stringify(json);
		  return(json)
	  }
	
	  public isVisable()
	{
		return(this.canvasHolder.isVisable())
	}
	
	public pointerUp(node)
	{
		//console.log("NodeCanvas.pointerUp:"+node.name)
	}
	
	public pointerMove(node)
	{
		//console.log("NodeCanvas.pointerMove:"+node.name)
	}
	
	public pointerDown(node)
	{
		//console.log("NodeCanvas.pointerDown:"+node.name)
	}
	
	public pause()
	{
		this.isAnimated = false;
	}
	
	public play()
	{
		this.isAnimated = true;
	    this.draw();
	}
	public draw()
	{
		var self = this;
		if(this.canvasHolder.isDrawable())
			requestAnimationFrame(function(timestamp) { self.drawCanvas(timestamp) }, false);
	}
	
	
	public setAnimationTimes(timestamp)
	{
		if(this.startAnimationTimeStamp==null) this.startAnimationTimeStamp = timestamp+0;
		if(this.startAnimationDate==null) this.startAnimationDate = new Date();
		var now = new Date();
		if(this.lastAnimationTimeStamp==null) this.lastAnimationTimeStamp = now;
	
		if(this.isAnimated)
		{
			this.animationExecTime += now.getTime()-this.lastAnimationTimeStamp.getTime();
			//console.log("now="+now+
			//	" lastAnimationTimeStamp="+this.lastAnimationTimeStamp+
			//	" animationExecTime="+this.animationExecTime+
			//	"");
		}
		this.lastAnimationTimeStamp = now;
	
	}
	
	
	public clearCanvas(timestamp)
	{
		if(this.isVisable() && this.canvasHolder.isDrawable())
		{
			this.canvasHolder.context.clearRect(0, 0, this.canvasHolder.getWidth(), this.canvasHolder.canvas.height);
			this.canvasHolder.context.fillStyle = Common.getColorFromString(this.fillStyle)
			this.canvasHolder.context.fillRect(0, 0, this.canvasHolder.getWidth(), this.canvasHolder.getHeight());
		}
	}


	public get $canvasHolder(): CanvasHolder {
		return this.canvasHolder;
	}

	public set $canvasHolder(value: CanvasHolder) {
		this.canvasHolder = value;
	}
	
}
