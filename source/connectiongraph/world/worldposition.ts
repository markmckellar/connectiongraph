import { WorldObject } from "./worldobject";


export class WorldPosition {
    private _x:number;
    private _y:number;

    public constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }

	public get x(): number {
		return this._x;
	}

	public set x(value: number) {
		this._x = value;
	}

	public get y(): number {
		return this._y;
	}

	public set y(value: number) {
		this._y = value;
	}

	public clone():WorldPosition {
		return(new WorldPosition(this.x,this.y));
	}

	public translate(worldPosition:WorldPosition):void {
		//this.x = this.x + worldPosition.x;
		//this.y = this.y + worldPosition.y;
		this.x = worldPosition.x;
		this.y = worldPosition.y;
	}

	public setWorldPosition(worldPosition:WorldPosition):void {
		this.x = worldPosition.x;
		this.y = worldPosition.y;
		
	}

	public getDeltaY(worldPosition:WorldPosition):number
	{
			return(this.y-worldPosition.y);
	}

	public getDeltaX(worldPosition:WorldPosition):number
	{
			return(this.x-worldPosition.x);
	}

	public getDelta(worldPosition:WorldPosition):WorldPosition
	{
			return(new WorldPosition(this.getDeltaX(worldPosition),this.getDeltaY(worldPosition)));
	}

	public equals(worldPosition:WorldPosition):boolean
	{
		return( (this.x==worldPosition.x) && (this.y==worldPosition.y) ) ;
	}

	public getDistance(worldPosition:WorldPosition):number
	{
		return (Math.sqrt(Math.pow(this.getDeltaX(worldPosition), 2) + Math.pow(this.getDeltaY(worldPosition), 2)));
	}

	public static getAveragePostionFromWorldPositionList(positionList:Array<WorldPosition>):WorldPosition
	{
		let x = 0.0;
		let y = 0.0;
		for(let i=0;i<positionList.length;i++)
		{
			let p = positionList[i];
			x += p.x;
			y += p.y;
		}
		x = x / positionList.length;
		y = y / positionList.length;
		return(new WorldPosition(x,y));
	}

	public static getAveragePostionFromWorldObjectList(worldObjectList:Array<WorldObject>):WorldPosition
	{
	  let x = 0.0;
	  let y = 0.0;
	  for(var i=0;i<worldObjectList.length;i++)
	  {
		  var p = worldObjectList[i].getWorldPosition();
		  x += p.x;
		  y += p.y;
	  }
	  x = x / worldObjectList.length;
	  y = y / worldObjectList.length;
	  return(new WorldPosition(x,y));
	}

	public static getPostionListFromNodeList(worldObjectList:Array<WorldObject>):Array<WorldPosition>
	{
		var positions = new Array<WorldPosition>();
		for (var i = 0; i < worldObjectList.length; i++)
		{
			positions.push(worldObjectList[i].getWorldPosition());
		}
		return(positions);
	}

}