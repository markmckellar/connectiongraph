import { WorldPosition } from "../../../world/worldposition";
import { WorldId } from "../../../world/worldid";
import { SpringEngine } from "../springengine";
import { SpringRectangle } from "./springrectangle";
import { TextEngineShape } from "../../shapes/textengineshape";
import { DrawableText } from "../../../display/drawableshapes/drawabletext";

export class SpringRectangleText extends SpringRectangle implements TextEngineShape
{
    private _drawableText:DrawableText;


	constructor(worldId:WorldId,drawableText:DrawableText,width:number,height:number,position:WorldPosition,options:any,springEngine:SpringEngine)
	{
        super(worldId,drawableText,width,height,position,options,springEngine);

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
