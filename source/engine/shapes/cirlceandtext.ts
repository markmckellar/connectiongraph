import { CircleEngineShape } from "./circleengineshape";
import { RectangleEngineShape } from "./rectangleengineshape";

export class CircleAndText {

    private _circle:CircleEngineShape;
    private _textBox:RectangleEngineShape;
    constructor() {

    }


	public get circle(): CircleEngineShape {
		return this._circle;
	}

	public set circle(value: CircleEngineShape) {
		this._circle = value;
	}

	public get textBox(): RectangleEngineShape {
		return this._textBox;
	}

	public set textBox(value: RectangleEngineShape) {
		this._textBox = value;
	}
    
}