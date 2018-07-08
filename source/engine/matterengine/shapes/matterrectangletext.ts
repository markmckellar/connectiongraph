import { WorldPosition } from "../../../world/worldposition";
import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { TextEngineShape } from "../../shapes/textengineshape";
import { MatterRectangle } from "./matterrectangle";
import { DrawableText } from "../../../display/drawableshapes/drawabletext";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class MatterRectangleText extends MatterRectangle implements TextEngineShape
{
    private _drawableText:DrawableText;

	constructor(worldId:WorldId,drawableText:DrawableText,width:number,height:number,position:WorldPosition,options:any,matterEngine:MatterEngine)
	{
        super(worldId,drawableText,width,height,position,options,matterEngine);
        this.drawableText = drawableText;
        //super(shapeName,radius);
        /*
		this.width = width;
		this.height = height;	
        this.rectangleBody = Matter.Bodies.rectangle(
            position.x,position.y,
			this.width,
			this.height,
            options);	
		this.rectangleBody.collisionFilter.category = MatterEngine.boundsFilter;
		drawableText.init(this,options);
		matterEngine.addMatterShape(this);
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
