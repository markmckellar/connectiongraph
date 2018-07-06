import { Drawable } from "../drawable";
import { WorldDisplay } from "../worlddisplay";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "./rectangledisplayshape";
import { World } from "../../world/world";
import { CanvasMouse } from "../canvas/canvasmouse";
import { WorldObjectEventHandler } from "../../world/worldobjecteventhandler";

class Size {
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

export class TextDisplayShape implements Drawable
{
    private _rectangleDisplayShape:RectangleDisplayShape;
    private _displayText:string;
	private _rectangleEngineShape:RectangleEngineShape;
	private _textImageData:ImageData;

	


	constructor(rectangleDisplayShape:RectangleDisplayShape,displayText:string)
	{
		this.rectangleEngineShape = null;
		this.rectangleDisplayShape = rectangleDisplayShape;
		this.displayText = displayText;
		this.textImageData = null;

	}

	public init(rectangleEngineShape:RectangleEngineShape,options:any):void {
		this.rectangleEngineShape = rectangleEngineShape;	
		this.rectangleDisplayShape.init(this.rectangleEngineShape,options);


		let woe:WorldObjectEventHandler = 
		{
			pointerDownEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void
			{
				console.log("LOOOOOLZZZZZ! HEY FELLA XXXXXXX");
				console.log("setSize:"+JSON.stringify({"width":this.width,"height":this.height}))


			},
			pointerMoveEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {},
			pointerUpEvent : function (world:World,canvasMouse:CanvasMouse,event:MouseEvent):void {}
		};

	
		this.rectangleEngineShape.setWorldObjectEventHandler(woe);
	

		/*
		this.rectangleEngineShape.getWorldObjectEventHandler().pointerMoveEvent = 
			function(world:World,canvasMouse:CanvasMouse,event:MouseEvent)
			{
				this.rectangleEngineShape.getWorldObjectEventHandler().pointerMoveEvent(world,canvasMouse,event);
				console.log("QQQQQQQQQQQQQQQQQQQ click on text box:"+JSON.stringify({"cw":this.width,"ch":this.height}));

			};
			*/
	}


    /**
     * Getter textImageData
     * @return {ImageData}
     */
	public get textImageData(): ImageData {
		return this._textImageData;
	}

    /**
     * Setter textImageData
     * @param {ImageData} value
     */
	public set textImageData(value: ImageData) {
		this._textImageData = value;
	}

	public get rectangleEngineShape(): RectangleEngineShape {
		return this._rectangleEngineShape;
	}

	public set rectangleEngineShape(value: RectangleEngineShape) {
		this._rectangleEngineShape = value;
    }
    
    /**
     * Getter rectangleDisplayShape
     * @return {RectangleDisplayShape}
     */
	public get rectangleDisplayShape(): RectangleDisplayShape {
		return this._rectangleDisplayShape;
	}

    /**
     * Setter rectangleDisplayShape
     * @param {RectangleDisplayShape} value
     */
	public set rectangleDisplayShape(value: RectangleDisplayShape) {
		this._rectangleDisplayShape = value;
	}

    /**
     * Getter displayText
     * @return {string}
     */
	public get displayText(): string {
		return this._displayText;
	}

    /**
     * Setter displayText
     * @param {string} value
     */
	public set displayText(value: string) {
		this._displayText = value;
	}
	
	

	
	public draw(context:CanvasRenderingContext2D):void
	{
		if(!this.rectangleEngineShape) throw Error("RectangleDisplayShape:rectangleEngineShape is not set, was init called?")
		//super.drawConnector(canvasHolder,node);
		/*
		super.drawNode(canvasHolder,node);

		*/
		//console.log("CircleDisplayShape.drawShape");

		/*
		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		//context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");
		context.strokeStyle = WorldDisplay.getColorFromString("00ff0011");
		
		context.lineWidth = 2;		        
		WorldDisplay.drawOutlinedShape(context,this.rectangleEngineShape.getShapePoints());
	*/

		//this.rectangleEngineShape.getDrawable().draw(context);

		let fitContentToText:boolean = true;
		// DRAW TEXT
		// IF FITTING CONTAINER SIZE TO CONTENT THEN :
		// ---
		// ---
		// ---
		// ---
		// IF FITTING TEXT SIZE TO CONTAINER THEN :
		if(fitContentToText)
		{


			/*
			context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
			context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");
			context.lineWidth = 2;
			WorldDisplay.drawOutlinedShape(context,this.rectangleEngineShape.getShapePoints());
	
			this.rectangleDisplayShape.draw(context);
*/			
//this.rectangleDisplayShape.draw(context);

			let needsARedraw:boolean = false;

			if(this.textImageData==null) needsARedraw = true;
			
			if(needsARedraw)
			{

				let hPadding:number = 15;
				let vPadding:number = 15;
				
				let fontPixelHeight:number = 15;
				this.setContextFont(context,"bold","Arial",15,"000000ff");


				let textSize:Size = this.metricsTextMutipleLines(context,
					this.displayText,fontPixelHeight,"\n");
				let containerSize = new Size(textSize.width+hPadding*2,textSize.height+vPadding*2);
				/*
				let scale = new Size(containerSize.width/this.rectangleEngineShape.getWidth(),
					containerSize.height/this.rectangleEngineShape.getHeight());
	*/
				this.rectangleEngineShape.setSize(containerSize.width,containerSize.height);

				//this.rectangleEngineShape.scaleShape(scale.height,scale.width);

				//console.log("XXXXXX:"+JSON.stringify(this.rectangleEngineShape.getWorldPosition()));
				
				//context.fillStyle = WorldDisplay.getColorFromString("ffffffff");
				//context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");




				//let textX = this.rectangleEngineShape.getWorldPosition().x - (textSize.width/2+hPadding);
				//let textY = this.rectangleEngineShape.getWorldPosition().y - (textSize.height/2+vPadding)

				let textX:number = this.rectangleEngineShape.getWorldPosition().x;// - (hPadding);
				let textY:number = this.rectangleEngineShape.getWorldPosition().y;// - (vPadding)

				this.rectangleDisplayShape.draw(context);

				this.setContextFont(context,"bold","Arial",15,"000000ff");


				this.drawTextMutipleLines(context,this.displayText,
					textX,textY,
					//this.rectangleEngineShape.getWorldPosition().x+hPadding,
					//this.rectangleEngineShape.getWorldPosition().y+vPadding,
					fontPixelHeight,"\n");
				console.log("drawing non cached text for :"+this.rectangleEngineShape.getWorldId);
					
				this.textImageData = context.getImageData(
					textX - (textSize.width/2),
					textY - (textSize.height/2),
					textSize.width,
					textSize.height
				);
				
			}
else{
			this.rectangleDisplayShape.draw(context);

			context.putImageData(
					this.textImageData,
					this.rectangleEngineShape.getWorldPosition().x-this.textImageData.width/2,
					this.rectangleEngineShape.getWorldPosition().y-this.textImageData.height/2
			
				);
			}
			// newW = currentW * scale
			// scaleW = newW / currentW
		}

		this.rectangleEngineShape.stopRotation();

		/*

		let position:WorldPosition = this.rectangleEngineShape.getWorldPosition();


		context.fillRect( 
			(position.x-this.rectangleEngineShape.getWidth()/2),
			(position.y-this.rectangleEngineShape.getHeight()/2),
			this.rectangleEngineShape.getWidth(),
			this.rectangleEngineShape.getHeight());
			context.lineWidth = 2;
		context.strokeRect( 
			(position.x-this.rectangleEngineShape.getWidth()/2), 
			(position.y-this.rectangleEngineShape.getHeight()/2), 
			this.rectangleEngineShape.getWidth(), 
			this.rectangleEngineShape.getHeight());
		*/

	}

	setContextFont(context:CanvasRenderingContext2D,fontStyle:string,fontFace:string,fontPixelHeight:number,fontColor:string)
	{
		//context.fillStyle = WorldDisplay.getColorFromString("ffffffff");
			//context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");

		context.font=fontStyle+" "+fontPixelHeight+"px "+fontFace; 
		context.textAlign="center";
		context.fillStyle=WorldDisplay.getColorFromString(fontColor);
	}

	private drawTextMutipleLines(context:CanvasRenderingContext2D,text:string,x:number,y:number,lineHeight:number,splitChar:string):void
	{
		let lines:string[] = text.split(splitChar);
	    let line = '';
	
	    for(let n = 0; n < lines.length; n++)
	    {
	      	//let metrics = context.measureText(lines[n]);
	      	context.fillText(lines[n], x, y);
	      	y = y+lineHeight; 
	    }
	    context.fillText(line, x, y);
	 }
	
	private metricsTextMutipleLines(context:CanvasRenderingContext2D,text:string,lineHeight:number,splitChar:string):Size
	{
		let lines = text.split(splitChar);
	    //let line = '';
	    let maxWidth = 0;
	    let totalHeight = 0;
	    for(let n = 0; n < lines.length; n++)
	    {
			let metrics = context.measureText(lines[n]);
	     	if(metrics.width>maxWidth) maxWidth = metrics.width;
	      	totalHeight = totalHeight + lineHeight;
		}
		//console.log("MEEETRICS!!!   ::::: "+JSON.stringify((new Size(maxWidth,totalHeight))));
		// TODO for some reason maxWidth is always 1 short, how come??!?! (coincidentally I think the java image libraries have the same issue)
	    return(new Size(maxWidth+1,totalHeight));
	 }



/*************************

	drawNode(canvasHolder,node)
	{
		super.drawNode(canvasHolder,node);
		//console.log("ZZZZZZZZZZZZZZ::::"+node.name);
	    var radiusAverage = 0;
	    for(var i=0;i<node.nodes.length;i++)
	    {
	     	var subNode = node.nodes[i];
	     	//console.log("            ZZZZZZZZZZZZZZ::::"+subNode.name);
	    	radiusAverage += subNode.graphData.nodeDisplay.displayInfo.radius;
	    }
	    if(radiusAverage!=0) radiusAverage = (radiusAverage / node.nodes.length);
	    radiusAverage += this.displayInfo.borderWidth*5;
	    
	    var junctionTexnewt = node.name;	    
	    var rectPadding = this.displayInfo.fontPixelHeight/2;
	    
	    canvasHolder.context.font=this.displayInfo.fontStyle+" "+this.displayInfo.fontPixelHeight+"px "+this.displayInfo.fontFace; 
	    canvasHolder.context.textAlign="center";
	    var textMetrics = this.metricsTextMutipleLines(
	    		canvasHolder.context,
	    		junctionText,
	    		this.displayInfo.fontPixelHeight,
	    		"\n");
	    
	    var totalWidth = Math.max(radiusAverage+rectPadding,textMetrics.width+rectPadding+rectPadding);
	    var totalHeight = 
	    	radiusAverage+
	    	this.displayInfo.borderWidth*2+
	    	node.graphData.textSpacer+
	    	textMetrics.height+rectPadding;
	    
	    node.width = totalWidth;
	    node.height = totalHeight;
	    
		if(!node.hasOwnProperty("checkPositionInfo"))
		{
			//console.log("**** "+node.name+" missing checkPositionInfo ---------------------");			
			node.checkPositionInfo = { makeItReal:"true", };
		}
		var x = node.position.getX();
		var y = node.position.getY();
		//x = this.drawPosition.getX();
		//y = this.drawPosition.getY();

	    //if(node.checkPositionInfo==null) node.checkPositionInfo = {};
	    node.checkPositionInfo.circlePosition = new Position(
	    		x,
	    		y-totalHeight/2.0+radiusAverage);
	    
	    node.connectorPosition.setY(-(totalHeight/2.0-radiusAverage));
	
	    
	    node.checkPositionInfo.textX = x-(textMetrics.width+rectPadding)/2.0;
	    node.checkPositionInfo.textY = node.checkPositionInfo.circlePosition.getY()+
	    	radiusAverage+
	    	this.displayInfo.borderWidth+
	    	node.graphData.textSpacer;
	    node.checkPositionInfo.textWidth = textMetrics.width+rectPadding;
	    node.checkPositionInfo.textHeight = textMetrics.height+rectPadding;
	
	    
	    this.roundedRect(
	    		canvasHolder.context,
	 		   node.checkPositionInfo.textX,
	 		   node.checkPositionInfo.textY,
	 		   node.checkPositionInfo.textWidth,
	 		   node.checkPositionInfo.textHeight,
	 		   this.displayInfo.fontPixelHeight/3,
	 		   this.displayInfo.borderWidth,
	 		   Common.getColorFromString(this.displayInfo.rectBorderColor),
	 		   Common.getColorFromString(this.displayInfo.rectFillColor) );
	    
	    
	    canvasHolder.context.fillStyle=Common.getColorFromString(this.displayInfo.fontColor);
	
	    this.fillTextMutipleLines(
	    		canvasHolder.context,
	    		junctionText,
	    		x,
	    		node.checkPositionInfo.textY+rectPadding*2.0+this.displayInfo.borderWidth,
	    		this.displayInfo.fontPixelHeight,
	    		"\n");
	  
	  
	    if(node.isSelected)
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(this.displayInfo.selectFillColor);
	    	canvasHolder.context.strokeStyle = Common.getColorFromString(this.displayInfo.selectBorderColor);
	    }
	    else
	    {
	    	canvasHolder.context.fillStyle = Common.getColorFromString(this.displayInfo.fillColor);
	        canvasHolder.context.strokeStyle = Common.getColorFromString(this.displayInfo.borderColor);
	    }
	  
	    console.log("name="+node.name+
	    		":selectFillColor="+this.displayInfo.selectFillColor+
	    		":fillColor="+this.displayInfo.fillColor+
	    		":X="+node.checkPositionInfo.circlePosition.getX()+
	    		":Y="+node.checkPositionInfo.circlePosition.getY()+
	    		":radius="+radiusAverage+
	    		""
	    		);
	  
	    
	
	    canvasHolder.context.beginPath();
	    canvasHolder.context.arc(
				node.checkPositionInfo.circlePosition.getX(),
				node.checkPositionInfo.circlePosition.getY(),
				radiusAverage,//node.graphData.radius,
				0,
				Math.PI * 2, false);
	    canvasHolder.context.closePath();
	    canvasHolder.context.fill();
	    canvasHolder.context.lineWidth = this.displayInfo.borderWidth;
	    canvasHolder.context.stroke();
	
	
	    for(var i=0;i<node.nodes.length;i++)
	    {
	     	var subNode = node.nodes[i];
	     	subNode.position = node.checkPositionInfo.circlePosition;
	    	subNode.graphData.nodeDisplay.drawNode(node.canvasHolder,subNode);
	    }	
	}

	fillTextMutipleLines(context,text,x,y,lineHeight,splitChar)
	{
		var lines = text.split(splitChar);
	    var line = '';
	
	    for(var n = 0; n < lines.length; n++)
	    {
	      var metrics = context.measureText(lines[n]);
	      context.fillText(lines[n], x, y);
	      y = y+lineHeight; 
	    }
	    context.fillText(line, x, y);
	 }
	
	metricsTextMutipleLines(context,text,lineHeight,splitChar)
	{
		var lines = text.split(splitChar);
	    var line = '';
	    var maxWidth = 0;
	    var totalHeight = 0;
	    for(var n = 0; n < lines.length; n++)
	    {
	      var metrics = context.measureText(lines[n]);
	      if(metrics.width>maxWidth) maxWidth = metrics.width;
	      totalHeight = totalHeight + lineHeight;
	    }
	    return({width:maxWidth,height:totalHeight});
	 }
	
	roundedRect(context,x,y,w,h,r,borderWitdh,borderColor,rectColor)
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
		
	    //context.beginPath();
	    //context.moveTo(x, y);
	    //context.lineTo(x + width - cornerRadius, y);
	    //context.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
	    //context.lineTo(x + width, y + height);
	    
	  context.lineWidth = borderWitdh;
	  context.fillStyle = rectColor;
	  context.strokeStyle = borderColor;
	  
	  context.stroke();
	  context.fill();
  
  }


  class Size {
	private _width:number;
	private _height:number;
	constructor(width:number,height:number)
	{

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
};

******************************/






}








