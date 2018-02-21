
export interface CanvasHolder
{
    getWidth():number;
    getHeight():number;
    isCanvasVisable(): boolean;
    isCanvasDrawable(): boolean;    
    getCanvas():HTMLCanvasElement;
	getContext():CanvasRenderingContext2D;
	
}
