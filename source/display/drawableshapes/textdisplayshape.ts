import { Drawable } from "../drawable";
import { WorldDisplay } from "../worlddisplay";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "./rectangledisplayshape";

export class TextDisplayShape implements Drawable
{
    private _rectangleDisplayShape:RectangleDisplayShape;
    private _displayText:string;
	private _rectangleEngineShape:RectangleEngineShape;

	constructor(rectangleDisplayShape:RectangleDisplayShape,displayText:string)
	{
		this.rectangleEngineShape = null;
		this.rectangleDisplayShape = rectangleDisplayShape;
		this.displayText = displayText;
	}

	public init(rectangleEngineShape:RectangleEngineShape,options:any):void {
		this.rectangleEngineShape = rectangleEngineShape;		
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

		context.fillStyle = WorldDisplay.getColorFromString("ff0000ff");
		context.strokeStyle = WorldDisplay.getColorFromString("0000ffff");

		context.lineWidth = 2;		        
		WorldDisplay.drawOutlinedShape(context,this.rectangleEngineShape.getShapePoints());
		

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
	    
	    var junctionText = node.name;	    
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
******************************/






}








}
