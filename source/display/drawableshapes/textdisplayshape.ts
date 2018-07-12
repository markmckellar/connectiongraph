import { Drawable } from "../drawable";
import { WorldDisplay, Size } from "../worlddisplay";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "./rectangledisplayshape";
import { World } from "../../world/world";
import { CanvasMouse } from "../canvas/canvasmouse";
import { WorldObjectEventHandler } from "../../world/worldobjecteventhandler";
import { DrawableText } from "./drawabletext";


export class TextDisplayShape implements DrawableText
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

	public getText():string
	{
		return(this.displayText);
	}

	public setText(displayText:string):void
	{
		this.textImageData = null;
		this.displayText = displayText;
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

				let textSize:Size = WorldDisplay.metricsTextMutipleLines(context,
					this.displayText,
					fontPixelHeight,
					"\n");

				let containerSize = new Size(textSize.width+hPadding*2,textSize.height+vPadding*2);
				
				this.rectangleEngineShape.setSize(textSize.width+hPadding*2,textSize.height+vPadding*2);
				this.rectangleDisplayShape.draw(context);

				// the rectangle may have reset our color
				this.setContextFont(context,"bold","Arial",15,"000000ff");

				WorldDisplay.drawTextMutipleLines(context,
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

/*******
 * 
 * context.font = '14pt Verdana';
 * 
 function measureTextHeight(fontSizeFace) {
    // create a temp canvas
    var width=1000;
    var height=60;
    var canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;
    var ctx=canvas.getContext("2d");

    // Draw the entire a-z/A-Z alphabet in the canvas
    var text="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ctx.save();
    ctx.font=fontSizeFace;
    ctx.clearRect(0,0,width,height);
    ctx.fillText(text, 0, 40);
    ctx.restore();

    // Get the pixel data from the canvas
    var data = ctx.getImageData(0,0,width,height).data,
        first = false, 
        last = false,
        r = height,
        c = 0;

    // Find the last line with a non-transparent pixel
    while(!last && r) {
        r--;
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                last = r;
                break;
            }
        }
    }

    // Find the first line with a non-transparent pixel
    while(r) {
        r--;
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                first = r;
                break;
            }
        }

        // If we've got it then return the height
        if(first != r) return last - first;
    }

    // error condition if we get here
    return 0;
}

 */
}








