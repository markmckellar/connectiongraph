import { Drawable } from "../drawable";



export interface DrawableText extends Drawable{
	
    setText(displayText:string):void;
    getText():string;
    
}