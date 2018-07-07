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
		
		let fitContentToText:boolean = true;
		// DRAW TEXT
		// IF FITTING CONTAINER SIZE TO CONTENT THEN :
		// ---
		// ---
		// ---
		// ---
		// IF FITTING TEXT SIZE TO CONTAINER THEN :
		let x = this.rectangleEngineShape.getWorldPosition().x;
		let y = this.rectangleEngineShape.getWorldPosition().y;

		if(fitContentToText)
		{
			let needsARedraw:boolean = false;
			if(this.textImageData==null) needsARedraw = true;
			
			if(needsARedraw)
			{
				let hPadding:number = 5;
				let vPadding:number = 5;	
				let fontPixelHeight:number = 15;
				this.setContextFont(context,"bold","Arial",15,"000000ff");

				let textSize:Size = this.metricsTextMutipleLines(context,
					this.displayText,
					fontPixelHeight,
					"\n");

				let containerSize = new Size(textSize.width+hPadding*2,textSize.height+vPadding*2);
				
				this.rectangleEngineShape.setSize(textSize.width+hPadding*2,textSize.height+vPadding*2);
				this.rectangleDisplayShape.draw(context);

				// the rectangle may have reset our color
				this.setContextFont(context,"bold","Arial",15,"000000ff");

				this.drawTextMutipleLines(context,
					this.displayText,
					x,
					y-textSize.height/2+fontPixelHeight,
					fontPixelHeight,"\n");

				this.textImageData = context.getImageData(
					x-textSize.width/2,
					y-textSize.height/2,
					textSize.width,
					textSize.height);
			}			

			this.rectangleDisplayShape.draw(context);
			context.putImageData(
					this.textImageData,
					x-this.textImageData.width/2,
					y-this.textImageData.height/2
			
				);
		}

		this.rectangleEngineShape.stopRotation();
	}

	private drawTextMutipleLines(context:CanvasRenderingContext2D,text:string,x:number,y:number,lineHeight:number,splitChar:string):void
	{
		let lines:string[] = text.split(splitChar);
	
	    for(let n = 0; n < lines.length; n++)
	    {
			context.fillText(lines[n], x, y);
			y = y+lineHeight;
	    }
	 }
	
	private metricsTextMutipleLines(context:CanvasRenderingContext2D,text:string,lineHeight:number,splitChar:string):Size
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

	setContextFont(context:CanvasRenderingContext2D,fontStyle:string,fontFace:string,fontPixelHeight:number,fontColor:string)
	{
		//context.fillStyle = WorldDisplay.getColorFromString("ffffffff");
			//context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");

		context.font=fontStyle+" "+fontPixelHeight+"px "+fontFace; 
		context.textAlign="center";
		context.fillStyle=WorldDisplay.getColorFromString(fontColor);
	}

	



/*************************

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
*****************/
}








