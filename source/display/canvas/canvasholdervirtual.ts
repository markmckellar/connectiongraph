import { CanvasHolder } from "./canvasholder";


export class CanvasHolderVirtual implements CanvasHolder
{
	private _virtualWidth:number;
	private _virtualHeight:number;
	private _isVisable:boolean;
	private _isDrawable:boolean;

	constructor(width:number,height:number,isCanvasVisable:boolean,isCanvasDrawable:boolean)
	{
		this.virtualWidth = width;
		this.virtualHeight = height;
		//this.canvas = null;
		//this.context = null;
		this.isVisable = false;
		this.isDrawable = false;
	}

	public getWidth():number
	{
		return(this.virtualWidth);
	}

	public getHeight():number
	{
		return(this.virtualHeight);
	}

	public isCanvasVisable(): boolean {
		return this._isVisable;
	}

	public isCanvasDrawable(): boolean {
		return this._isDrawable;
	}

	public get virtualWidth(): number {
		return this._virtualWidth;
	}

	public set virtualWidth(value: number) {
		this._virtualWidth = value;
	}

	public get virtualHeight(): number {
		return this._virtualHeight;
	}

	public set virtualHeight(value: number) {
		this._virtualHeight = value;
	}

	public get isVisable(): boolean {
		return this._isVisable;
	}

	public set isVisable(value: boolean) {
		this._isVisable = value;
	}

	public get isDrawable(): boolean {
		return this._isDrawable;
	}

	public set isDrawable(value: boolean) {
		this._isDrawable = value;
	}
	
}
