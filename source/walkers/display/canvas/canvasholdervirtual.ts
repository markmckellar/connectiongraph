import { CanvasHolder } from "./canvasholder";


export class CanvasHolderVirtual extends CanvasHolder
{
	private _width:number;
	private _height:number;

	constructor(canvasName,worldDef,width,height,origin)
	{
		super(canvasName);
		this.width = width;
		this.height = height;
		this.canvas = null;
		this.context = null;
		this.isCanvasVisable = false;
		this.isCanvasDrawable = false;
	}

	clone(origin)
	{
		var canvasHolder = new CanvasHolderVirtual(this.canvasName,this.worldDef,this.width,this.height,origin);
		return(canvasHolder);
	}

	public getWidth()
	{
		return(this.width);
	}

	public getHeight()
	{
		return(this.height);
	}


	public get height(): number {
		return this._height;
	}

	public set height(value: number) {
		this._height = value;
	}

	public get width(): number {
		return this._width;
	}

	public set width(value: number) {
		this._width = value;
	}
	
}
