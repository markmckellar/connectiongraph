import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";
import { MockEngine } from "../mockengine";
import { PolygonEngineShape } from "../../shapes/polygonengineshape";
import { WorldDisplay } from "../../../display/worlddisplay";


export class MockPolygon extends MockShape implements PolygonEngineShape
{
    private _polygonPointArray:Array<WorldPosition>;
    private _numberOfSides:number;
    private _radius:number;
    

    constructor(worldId:WorldId,drawable:Drawable,numberOfSides:number,radius:number,worldPosition:WorldPosition,options:any,mockEngine:MockEngine)    
	{
        super(worldId,drawable,worldPosition,options);
        this.radius = radius;
        this.numberOfSides = numberOfSides;
        this.polygonPointArray = WorldDisplay.getPolygonPoints(0,numberOfSides,radius,worldPosition);
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

    public 	getShapePoints():Array<WorldPosition> {
        return(this.polygonPointArray);
    }    

    public 	getPointList():Array<WorldPosition> {
        return(this.polygonPointArray);
    }    

    public translate(worldPosition:WorldPosition):void {
        super.translate(worldPosition);
        //this.polygonPointArray = WorldDisplay.getPolygonPoints(0,this.numberOfSides,this.radius,worldPosition);
        
            for(let i=0;i<this.polygonPointArray.length;i++) 
                this.polygonPointArray[i].translate(this.getWorldPosition());
	}

	
	public setWorldPosition(worldPosition:WorldPosition):void {
       super.setWorldPosition(worldPosition);
       this.polygonPointArray = WorldDisplay.getPolygonPoints(0,this.numberOfSides,this.radius,this.getWorldPosition());

       // TODO this is not working becasue it moves all points to the same point... it should be getting the offset from the set
       // position and moving each point by that amount
      //  for(let i=0;i<this.polygonPointArray.length;i++) 
      //    this.polygonPointArray[i].setWorldPosition(this.getWorldPosition());
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
