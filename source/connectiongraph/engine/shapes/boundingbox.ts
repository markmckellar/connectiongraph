import { WorldPosition } from "../../world/worldposition";


export class BoundingBox
{
	private _pointList:Array<WorldPosition>;
	private _width:number;
	private _height:number;
	private _position:WorldPosition;

	constructor(pointList:Array<WorldPosition>)
	{
		this.pointList = pointList;
		this.initBoundingBox();
	
	}
    
    /*
	
	containsPosition(position,node)
	{
		if(!this.initDone) this.initBoundingBox();
	
		return(
				(
						(this.xMin.getX()+node.position.getX())>=position.x &&
						(this.xMax.getX()+node.position.getX())<=position.x &&
						(this.yMin.getY()+node.position.getY())>=position.y &&
						(this.yMax.getY()+node.position.getY())<=position.y
				)
			);
	}
	*/
	private initBoundingBox()
	{
		
		let xMin:number = null;
		let xMax:number = null;
		let yMin:number = null;
		let yMax:number = null;

		for(var i=0;i<this.pointList.length;i++)
		{
			var p:WorldPosition = this.pointList[i];
			if(xMin==null) xMin = p.x;
			if(xMax==null) xMax = p.x;
			if(yMin==null) yMin = p.y;
			if(yMax==null) yMax = p.y;
			
			if(p.x<xMin) xMin = p.x;
			if(p.x>xMax) xMax = p.x;
			if(p.y<yMin) yMin = p.y;
			if(p.y>yMax) yMax = p.y;
	
		}
		
		this.width = xMax-xMin;
		this.height = yMax-yMin;
		this.position = new WorldPosition(xMin,yMin);
    }
    

	public get pointList(): Array<WorldPosition> {
		return this._pointList;
	}

	public set pointList(value: Array<WorldPosition>) {
		this._pointList = value;
	}


    /**
     * Getter height
     * @return {number}
     */
	public get height(): number {
		return this._height;
	}

    /**
     * Setter height
     * @param {number} value
     */
	public set height(value: number) {
		this._height = value;
	}


    /**
     * Getter width
     * @return {number}
     */
	public get width(): number {
		return this._width;
	}

    /**
     * Setter width
     * @param {number} value
     */
	public set width(value: number) {
		this._width = value;
	}

    /**
     * Getter position
     * @return {WorldPosition}
     */
	public get position(): WorldPosition {
		return this._position;
	}

    /**
     * Setter position
     * @param {WorldPosition} value
     */
	public set position(value: WorldPosition) {
		this._position = value;
	}

    
}
