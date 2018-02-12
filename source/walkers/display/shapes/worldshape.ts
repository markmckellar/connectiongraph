import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkerworld/walkerworld";
import { WorldObjectDisplay } from "../worldobjectdisplay";



export abstract  class WorldShape {
    private _shapePoints:Array<WorldPosition>;
	private _offsetFromOrigin:WorldPosition;
	private _shapeName:string;

    constructor(shapeName:string,shapePoints:Array<WorldPosition>,offsetFromOrigin:WorldPosition)
    {
		this.shapeName = shapeName;
        this.shapePoints = shapePoints;
        this.offsetFromOrigin = offsetFromOrigin;
    }

	public abstract drawShape(worldObjectDisplay:WorldObjectDisplay,walkerWorld:WalkerWorld,context:CanvasRenderingContext2D,):void;
    
    

    public static fillTextMutipleLines(context:CanvasRenderingContext2D,text:string,x:number,y:number,lineHeight:number,splitChar:string)
	{
		let lines:Array<string> = text.split(splitChar);
	    let line:string = '';
	
	    for(let n = 0; n < lines.length; n++)
	    {
	      //let metrics:TextMetrics = context.measureText(lines[n]);
	      context.fillText(lines[n], x, y);
	      y = y+lineHeight; 
	    }
	    context.fillText(line, x, y);
	 }
	
    public static metricsTextMutipleLines(context:CanvasRenderingContext2D,text:string,lineHeight:number,splitChar:string)
	{
		let lines:Array<string> = text.split(splitChar);
	    //let line:string = '';
	    let maxWidth:number = 0;
	    let totalHeight = 0;
	    for(var n = 0; n < lines.length; n++)
	    {
            let metrics:TextMetrics = context.measureText(lines[n]);
            if(metrics.width>maxWidth) maxWidth = metrics.width;
            totalHeight = totalHeight + lineHeight;
	    }
	    return({width:maxWidth,height:totalHeight});
	 }
	
    public static roundedRect(context:CanvasRenderingContext2D,x:number,y:number,
        w:number,h:number,r:number,borderWitdh:number,borderColor:string,rectColor:string):void
	{
		  if (w < 2 * r) r = w / 2;
		  if (h < 2 * r) r = h / 2;
		  context.beginPath();
		  context.moveTo(x+r, y);
		  context.arcTo(x+w, y,   x+w, y+h, r);
		  context.arcTo(x+w, y+h, x,   y+h, r);
		  context.arcTo(x,   y+h, x,   y,   r);
		  context.arcTo(x,   y,   x+w, y,   r);
		  context.closePath();
		/*
	    context.beginPath();
	    context.moveTo(x, y);
	    context.lineTo(x + width - cornerRadius, y);
	    context.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
	    context.lineTo(x + width, y + height);
	   */ 
	    context.lineWidth = borderWitdh;
	    context.fillStyle = rectColor;
	    context.strokeStyle = borderColor;
	    
	    context.stroke();
	    context.fill();
	
	}
    

	public get offsetFromOrigin(): WorldPosition {
		return this._offsetFromOrigin;
	}

	public set offsetFromOrigin(value: WorldPosition) {
		this._offsetFromOrigin = value;
	}
    

	public get shapePoints(): Array<WorldPosition> {
		return this._shapePoints;
	}

	public set shapePoints(value: Array<WorldPosition>) {
		this._shapePoints = value;
	}
	

	public get shapeName(): string {
		return this._shapeName;
	}

	public set shapeName(value: string) {
		this._shapeName = value;
	}
	
};