import { WorldPosition } from "../../../world/worldposition";
import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";
import { PolygonEngineShape } from "../../shapes/polygonengineshape";
import { MatterTools } from "../mattertools";

export class MatterPolygon extends MatterShape implements PolygonEngineShape
{
    private _numberOfSides:number;
    private _radius:number;
    private _polygonBody:Matter.Body;
    

    constructor(worldId:WorldId,drawable:Drawable,numberOfSides:number,radius:number,position:WorldPosition,options:any,matterEngine:MatterEngine)    
	{
        super(worldId,drawable,position,options);
        this.numberOfSides = numberOfSides;
        this.radius = radius;
        this.polygonBody = Matter.Bodies.polygon(
            position.x,position.y,
            this.numberOfSides,
            this.radius,
            options,
        );	
		this.polygonBody.collisionFilter.category = MatterEngine.boundsFilter;
		matterEngine.addMatterShape(this);
        drawable.init(this,options);
        //Matter.Sleeping.set(this.getBody(), true);
        
    }
    
    public getBody():Matter.Body {
		return(this.polygonBody);
	}



    public getRadius():number {
        return(this.radius);
    }

    public getNumberOfSides():number {
        return(this.numberOfSides);
    }

    public 	getPointList():Array<WorldPosition> {
        return( MatterTools.getWorldPostionArrayFromVectorArray(this.polygonBody.vertices) );
    }    

    public getPolygonPoints():Array<WorldPosition> {
        return( MatterTools.getWorldPostionArrayFromVectorArray(this.polygonBody.vertices) );     
    }


	public get polygonBody(): Matter.Body {
		return this._polygonBody;
	}

	public set polygonBody(value: Matter.Body) {
		this._polygonBody = value;
	}
    
    
	public get radius(): number {
		return this._radius;
	}

	public set radius(value: number) {
		this._radius = value;
	}
    
	public get numberOfSides(): number {
		return this._numberOfSides;
	}

	public set numberOfSides(value: number) {
		this._numberOfSides = value;
	}

}
