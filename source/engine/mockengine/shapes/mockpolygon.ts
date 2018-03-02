import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";
import { MockEngine } from "../mockengine";
import { PolygonEngineShape } from "../../shapes/polygonengineshape";

export class MockPolygon extends MockShape implements PolygonEngineShape
{
    private _polygonPointArray:Array<WorldPosition>;
    private _numberOfSides:number;
    private _radius:number;
    

    constructor(worldId:WorldId,drawable:Drawable,numberOfSides:number,radius:number,worldPosition:WorldPosition,options:any,mockEngine:MockEngine)    
	{
		super(worldId,drawable,worldPosition,options);
        this.polygonPointArray = Array<WorldPosition>();	
        this.numberOfSides = numberOfSides;
        this.radius = radius;
        let angle = 0
        let angleIncrement = 2 * Math.PI / this.numberOfSides;
    
        for(let i=0;i < this.numberOfSides;i++) {
            this.polygonPointArray.push(new WorldPosition(
                worldPosition.x  + radius * Math.cos(angle),
                worldPosition.y  + radius * Math.sin(angle)
            ));
            angle = angle + angleIncrement;
                
        }

		drawable.init(this,options);
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
        //if(this.boundingBox.containsPosition(position,node)) return false;
        
        let i = 0;
        let j = 0;
        let c = false;
        for(i=0,j=this.polygonPointArray.length-1;i< this.polygonPointArray.length;j=i++)
        {
            //
            var pi = this.polygonPointArray[i];
            var pj = this.polygonPointArray[j];
                
            if (
                ((pi.y>worldPosition.y) != (pj.y>worldPosition.y)) &&
                    (worldPosition.x < (pj.x-pi.x) *
                    (worldPosition.y-pi.y) /
                    (pj.y-pi.y) +
                    pi.x) )
                c = !c;
        }
        return c;
    }

    public getRadius():number {
        return(this.radius);
    }

    public getNumberOfSides():number {
        return(this.numberOfSides);
    }

    public 	getPointList():Array<WorldPosition> {
        return(this.polygonPointArray);
    }    

    public translate(worldPosition:WorldPosition):void {
        super.translate(worldPosition);
        for(let i=0;i<this.polygonPointArray.length;i++) 
            this.polygonPointArray[i].translate(worldPosition);
	}

	
	public setWorldPosition(worldPosition:WorldPosition):void {
        super.translate(worldPosition);
        for(let i=0;i<this.polygonPointArray.length;i++) 
            this.polygonPointArray[i].moveTo(worldPosition);
	}


	

    public getPolygonPoints():Array<WorldPosition> {
        return(this.polygonPointArray);

    }
    

	public get radius(): number {
		return this._radius;
	}

	public set radius(value: number) {
		this._radius = value;
	}
    


	public get polygonPointArray(): Array<WorldPosition> {
		return this._polygonPointArray;
	}

	public set polygonPointArray(value: Array<WorldPosition>) {
		this._polygonPointArray = value;
	}


	public get numberOfSides(): number {
		return this._numberOfSides;
	}

	public set numberOfSides(value: number) {
		this._numberOfSides = value;
	}

}
