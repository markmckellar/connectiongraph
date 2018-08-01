import { Drawable } from "../drawable";
import { TextDisplayShape } from "./textdisplayshape";



export interface TextUpdateHandler {
    handleTextUpdate(textDisplayShape:TextDisplayShape):void;
}