import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";
import { MockEngine } from "../mockengine";
import { MockRectangle } from "./mockrectangle";
import { TextEngineShape } from "../../shapes/textengineshape";
import { DrawableText } from "../../../display/drawableshapes/drawabletext";

export class MockRectangleText extends MockRectangle implements TextEngineShape
{
    private _drawableText:DrawableText;


	constructor(worldId:WorldId,drawableText:DrawableText,width:number,height:number,position:WorldPosition,options:any,mockEngine:MockEngine)
	{
        super(worldId,drawableText,width,height,position,options,mockEngine);
        this.drawableText = drawableText;

/*
		super(worldId,drawable,position,options);
		this.width = width;
		this.height = height;	
        drawable.init(this,options);
        */
	}
    public setText(displayText:string):void {
        this.drawableText.setText(displayText);
    }

	public getText():string {
        return(this.drawableText.getText());
    }

    /**
     * Getter drawableText
     * @return {DrawableText}
     */
	public get drawableText(): DrawableText {
		return this._drawableText;
	}

    /**
     * Setter drawableText
     * @param {DrawableText} value
     */
	public set drawableText(value: DrawableText) {
		this._drawableText = value;
	}



}
