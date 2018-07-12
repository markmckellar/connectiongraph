
import { WorldPosition } from "../world/worldposition";
import { World } from "../world/world";
import { CanvasMouse } from "./canvas/canvasmouse";

export class Size {
	private _width:number;
	private _height:number;

	constructor(width:number,height:number)
	{
		this.width = width;
		this.height = height;
	}
	public get width(): number {
		return this._width;
	}

	public set width(value: number) {
		this._width = value;
	}
	public get height(): number {
		return this._height;
	}

	public set height(value: number) {
		this._height = value;
	}
}

export class WorldDisplay  {
    /*
    static world(render:Matter.Render) {

        Matter.Render.world(render);
        console.log("doing some redering...");
    }
    */    

   public static  drawTextMutipleLines(context:CanvasRenderingContext2D,text:string,x:number,y:number,lineHeight:number,splitChar:string):void
   {
	   let lines:string[] = text.split(splitChar);
   
	   for(let n = 0; n < lines.length; n++)
	   {
		   context.fillText(lines[n], x, y);
		   y = y+lineHeight;
	   }
	}
   
	public static  metricsTextMutipleLines(context:CanvasRenderingContext2D,text:string,lineHeight:number,splitChar:string):Size
   {
	   let lines = text.split(splitChar);
	   let maxWidth = 0;
	   let totalHeight = lineHeight/2;
	   for(let n = 0; n < lines.length; n++)
	   {
		   let metrics = context.measureText(lines[n]);
			if(metrics.width>maxWidth) maxWidth = metrics.width;
		   totalHeight = totalHeight + lineHeight;
		}
	   // TODO for some reason maxWidth is always 1 short, how come??!?! (coincidentally I think the java image libraries have the same issue)

	   return(new Size(maxWidth+1,totalHeight));
	}

	/*
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
	 */

    public static getColorFromString(colorString:string):string
    {
      if(colorString.length==6)
      {
        colorString += "ff";
      }
      
      let color = "rgba("+
          parseInt(colorString.substring(0,2), 16)+","+
          parseInt(colorString.substring(2,4), 16)+","+
          parseInt(colorString.substring(4,6), 16)+","+
          parseInt(colorString.substring(6,8), 16)/255.0+")";
      
      return(color);
	}

	public static getWorldPositionFromMouseEvent(world:World,canvasMouse:CanvasMouse,event:MouseEvent):WorldPosition {
		var eventPosition:WorldPosition = new WorldPosition(event.pageX-canvasMouse.offset.x,event.pageY-canvasMouse.offset.y);
		return(eventPosition);
	}


	public static getPolygonPoints(startAngle:number,numberOfSides:number,radius:number,position:WorldPosition):Array<WorldPosition> {
		let polygonPointArray = Array<WorldPosition>();	
        let angle = 0
        let angleIncrement = 2 * Math.PI / numberOfSides;
    
        for(let i=0;i < numberOfSides;i++) {
            polygonPointArray.push(new WorldPosition(
                position.x  + radius * Math.cos(angle),
                position.y  + radius * Math.sin(angle)
            ));
            angle = angle + angleIncrement;
                
		}
		return(polygonPointArray);
	}

/**
	 * Draws an outlined shape from an Array of WorldPosition objects. It is assumed that the fill color, 
	 * stroek color and line width for the context have been set before the call is made
	 * 
	 * @static
	 * @param {CanvasRenderingContext2D} context 
	 * @param {Array<WorldPosition>} worldPositionArray 
	 * @memberof WorldDisplay
	 */
	public static drawConnectedLine(context:CanvasRenderingContext2D,worldPositionArray:Array<WorldPosition>):void
	{	    
	    context.beginPath();
	    for(let i=0;i<worldPositionArray.length;i++)
	    {   	
			var point = worldPositionArray[i];
	    	if(i==0) context.moveTo(point.x,point.y);
	    	else context.lineTo(point.x,point.y);
	    }
	    //context.closePath();
	    
	    //context.fill();
	    //context.lineWidth = displayInfo.borderWidth;
	    context.stroke();
	}

	/**
	 * Draws an outlined shape from an Array of WorldPosition objects. It is assumed that the fill color, 
	 * stroek color and line width for the context have been set before the call is made
	 * 
	 * @static
	 * @param {CanvasRenderingContext2D} context 
	 * @param {Array<WorldPosition>} worldPositionArray 
	 * @memberof WorldDisplay
	 */
	public static drawOutlinedShape(context:CanvasRenderingContext2D,worldPositionArray:Array<WorldPosition>):void
	{	    
	    context.beginPath();
	    for(let i=0;i<worldPositionArray.length;i++)
	    {   	
			var point = worldPositionArray[i];
	    	if(i==0) context.moveTo(point.x,point.y);
	    	else context.lineTo(point.x,point.y);
	    }
	    context.closePath();
	    
	    context.fill();
	    //context.lineWidth = displayInfo.borderWidth;
	    context.stroke();
	}

	public static getAveragePostionFromPositionList(positionList:Array<WorldPosition>):WorldPosition
	{
	  let x = 0.0;
	  let y = 0.0;
	  for(let i=0;i<positionList.length;i++)
	  {
		  let p = positionList[i];
		  x += p.x;
		  y += p.y;
	  }
	  x = x / positionList.length;
	  y = y / positionList.length;
	  return(new WorldPosition(x,y));
	}
		  

    public static getCirclePositionList(radius:number,curvePoints:number):Array<WorldPosition> {
		let pointList = new Array<WorldPosition>();
		
		let angleInc = 360 / curvePoints;
		for(let angle=0;angle<=360;angle=angle+angleInc)
		{
			let rads = angle * (Math.PI/180);
			pointList.push(
					new WorldPosition(
							radius*Math.cos(rads),
							radius*Math.sin(rads))
					);	
		}
		
		return(pointList);
	}

	public static getTrianglePositionList(width:number,height:number):Array<WorldPosition> {
		let pointList = new Array<WorldPosition>();
		
		pointList.push(new WorldPosition(0,-(height/2)));
		pointList.push(new WorldPosition(width/2,height/2));
		pointList.push(new WorldPosition(-(width/2),height/2));
		pointList.push(new WorldPosition(0,-(height/2)));
		
		return(pointList);;
	}
	
	public static getRectanglePositionList(width:number,height:number):Array<WorldPosition> {
		let pointList = new Array<WorldPosition>();
		
		pointList.push(new WorldPosition(-(width/2),-(height/2)));
		pointList.push(new WorldPosition((width/2),-(height/2)));
		pointList.push(new WorldPosition((width/2),(height/2)));
		pointList.push(new WorldPosition(-(width/2),(height/2)));	
		pointList.push(new WorldPosition(-(width/2),-(height/2)));
	
		return(pointList);;
	}

	public static getArcPositionList(endAngle:number,startAngle:number,radius:number,curvePoints:number):Array<WorldPosition> {
		let pointList = new Array<WorldPosition>();
		
		// bug durring the port to javascript... it was just expecting one arg so probably endAngle was used
		let angle:number = Math.abs(endAngle-startAngle);
		let angleInc:number = angle / curvePoints;
		
		pointList.push(new WorldPosition(0,0));
		for(let angle=startAngle;
			angle<=endAngle && angleInc>0;
			angle=angle+angleInc)
		{
			if( (angle+angleInc) > endAngle )
			{
				if(angle!=endAngle) angle = endAngle ;
			}
			var rads = angle * (Math.PI/180);
			pointList.push(
					new WorldPosition(
							radius*Math.cos(rads),
							radius*Math.sin(rads))
					);	
		}
		
		pointList.push(new WorldPosition(0,0));
		
		return(pointList);
	}

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
}
