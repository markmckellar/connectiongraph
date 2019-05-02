import { WorldPosition } from "../../../world/worldposition";
import { WorldId } from "../../../world/worldid";
import { EngineConnector } from "../../connectors/engineconnector";
import { DrawableConnector } from "../../../display/drawableshapes/drawableconnector";
import { EngineConnectorDef } from "../../connectors/engineconnectordef";
import { EngineShape } from "../../shapes/engineshape";
import { SpringShape } from "./springshape";
import { SpringEngine } from "../springengine";
import { SpringConnectorDef } from "./springconnectordef";
import { WorldEngineBase } from "../../worldendginebase";

export class SpringConnector extends SpringShape implements EngineConnector
{
    private _drawableConnector:DrawableConnector;
    private _springConnectorDefArray:Array<SpringConnectorDef>;
    private _connectorShape:EngineShape;
    public springShape:SpringShape;

    constructor(
        worldId:WorldId,
        drawableConnector:DrawableConnector,
        connectorShape:EngineShape,
        springConnectorDefArray:Array<SpringConnectorDef>,
        options:any,
        springEngine:SpringEngine)
	{
       super(worldId,drawableConnector,connectorShape.getWorldPosition(),options,springEngine);
       this.drawableConnector = drawableConnector;
       this.springConnectorDefArray = springConnectorDefArray;
       this.connectorShape = connectorShape;
       this.springShape = springEngine.getSpringShape(connectorShape.getWorldId()); 

       connectorShape.getDrawable().init(connectorShape,options);        
       drawableConnector.init(this,options);
       this.setSelectable(false);

    }

    public getAllSpringShapes():Array<SpringShape> {
        let allShapes = new Array<SpringShape>();
        allShapes.push(this.springShape);
        for(let i=0;i<this.springConnectorDefArray.length;i++) {
            let conectorDef = this.springConnectorDefArray[i];
            //console.log("getAllSpringShapes:this.springConnectorDefArray.lengt="+this.springConnectorDefArray.length+":i="+i+":shape="+conectorDef.engineShape.getWorldId().id);

            allShapes.push(conectorDef.springShape);
        }

        return(allShapes);
    }

    public processConection() {
        for(let i=0;i<this.springConnectorDefArray.length;i++) {
            let conectorDef = this.springConnectorDefArray[i];
            let otherSpringShape = conectorDef.springShape;

            let shapePos = this.springShape.getWorldPosition();
            if(!this.springShape.isSelected())
            {
                shapePos =  WorldEngineBase.calulateSpringMovement(
                    this.springShape,
                    otherSpringShape.getWorldPosition(),
                    conectorDef.length,conectorDef.stiffness);

                this.springShape.moveList.push(shapePos);
            }
            if(!otherSpringShape.isSelected())                        
                otherSpringShape.moveList.push(
                    WorldEngineBase.calulateSpringMovement(
                        otherSpringShape,
                        shapePos,
                        //this.springShape.getWorldPosition(),
                        conectorDef.length,conectorDef.stiffness) );
        }
    }

    public getShapePoints():Array<WorldPosition> {
        //return( WorldDisplay.getPolygonPoints(Math.PI/4,4,this.getWidth()+this.get,this.getWorldPosition() ) ;
        //return(this.connectorCircleBody.getShapePoints());
        return( this.connectorShape.getShapePoints());
    }


    /**
     * Getter mockConnectorDefArray
     * @return {Array<MockConnectorDef>}
     */
	public get springConnectorDefArray(): Array<SpringConnectorDef> {
		return this._springConnectorDefArray;
	}

    /**
     * Setter mockConnectorDefArray
     * @param {Array<MockConnectorDef>} value
     */
	public set springConnectorDefArray(value: Array<SpringConnectorDef>) {
		this._springConnectorDefArray = value;
	}


    public getEngineConnectorDefArray():Array<EngineConnectorDef> {
        return(this._springConnectorDefArray);
    }

/*
    public getMiddleWorldPosition():WorldPosition {
        let positions = new Array<WorldPosition>();
        for(let i=0;i<this.mockConnectorDefArray.length;i++) positions.push(this.mockConnectorDefArray[i].engineShape.getWorldPosition());
        let middle:WorldPosition = WorldDisplay.getAveragePostionFromPositionList(positions);
        return(middle);
    }
*/

    /**
     * Getter connectorShape
     * @return {EngineShape}
     */
	public get connectorShape(): EngineShape {
		return this._connectorShape;
	}

    /**
     * Setter connectorShape
     * @param {EngineShape} value
     */
	public set connectorShape(value: EngineShape) {
		this._connectorShape = value;
	}


    public containsWorldPosition(worldPosition:WorldPosition):boolean {
        return(this.connectorShape.containsWorldPosition(worldPosition));
        //return(false);
    }

    /*
    public isSelected(): boolean { return(this.connectorShape.isSelected()); }

    
    public getWorldPosition():WorldPosition {
        //return(this.getMiddleWorldPosition());
        //return(super.getWorldPosition());
        return(this.connectorShape.getWorldPosition());

    }

	public translate(worldPosition:WorldPosition):void {
        this.connectorShape.translate(worldPosition);
    }

	public setWorldPosition(worldPosition:WorldPosition):void {
        this.connectorShape.setWorldPosition(worldPosition);
    }
    */
/*
    public containsWorldPosition(worldPosition:WorldPosition):boolean {
        return(false);
    }

	public getDrawable():Drawable {
        return(this.drawableConnector);
     }

*/



    /**
     * Getter drawableConnector
     * @return {DrawableConnector}
     */
	public get drawableConnector(): DrawableConnector {
		return this._drawableConnector;
	}

    /**
     * Setter drawableConnector
     * @param {DrawableConnector} value
     */
	public set drawableConnector(value: DrawableConnector) {
		this._drawableConnector = value;
	}


    /**
     * Getter connectorCircleBody
     * @return {Matter.Body}
     *
	public get connectorCircleBody(): MockCircle {
		return this._connectorCircleBody;
	}

    /**
     * Setter connectorCircleBody
     * @param {Matter.Body} value
     *
	public set connectorCircleBody(value: MockCircle) {
		this._connectorCircleBody = value;
	}
*/

    

}
