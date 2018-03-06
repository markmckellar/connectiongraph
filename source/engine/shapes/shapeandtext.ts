import { CircleEngineShape } from "./circleengineshape";
import { RectangleEngineShape } from "./rectangleengineshape";
import { EngineShape } from "./engineshape";

export class ShapeAndText {

    private _objectShape:EngineShape;
    private _textBox:RectangleEngineShape;
    constructor() {

    }


	public get objectShape(): EngineShape {
		return this._objectShape;
	}

	public set objectShape(value: EngineShape) {
		this._objectShape = value;
	}

	public get textBox(): RectangleEngineShape {
		return this._textBox;
	}

	public set textBox(value: RectangleEngineShape) {
		this._textBox = value;
	}
    
}