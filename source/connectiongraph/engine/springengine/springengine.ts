import { WorldEngine } from "../worldengine";
import { Drawable } from "../../display/drawable";
import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
import { CircleEngineShape } from "../shapes/circleengineshape";
import { RectangleEngineShape } from "../shapes/rectangleengineshape";
import { SpringCircle } from "./shapes/springcircle";
import { SpringRectangle } from "./shapes/springrectangle";
import { SpringPolygon } from "./shapes/springpolygon";
import { PolygonEngineShape } from "../shapes/polygonengineshape";
import { CanvasMouse } from "../../display/canvas/canvasmouse";
import { MouseEventHandler } from "../../display/canvas/mouseeventhandler";
import { World } from "../../world/world";
import { EngineShape } from "../shapes/engineshape";
import { TextDisplayShape } from "../../display/drawableshapes/textdisplayshape";
import { TextEngineShape } from "../shapes/textengineshape";
import { SpringRectangleText } from "./shapes/springrectangletext";
import { DrawableConnector } from "../../display/drawableshapes/drawableconnector";
import { EngineConnectorDef } from "../connectors/engineconnectordef";
import { EngineConnector } from "../connectors/engineconnector";
import { SpringConnectorDef } from "./shapes/springconnectordef";
import { SpringConnector } from "./shapes/springconnector";
import { SpringShape } from "./shapes/springshape";
import { WorldEngineParams } from "../worldengineparams";
import { WorldEngineBase } from "../worldenginebase";

export class SpringEngine extends WorldEngineBase implements WorldEngine {
  private _mouseAnchor: SpringCircle;
  private _connectorArray:Array<SpringConnector>;
  private _springShapes : Map<WorldId,SpringShape>;
  //private springShapeArray : Array<SpringShape>;


  public constructor(worldEngineParams:WorldEngineParams) {
    super(worldEngineParams);

    this.springShapes = new Map<WorldId,SpringShape>();
    //this.springShapeArray = new Array<SpringConnector>();

    this.connectorArray = new Array<SpringConnector>();

    this.mouseAnchor = new SpringCircle(
      new WorldId("mouseAnchor"),
      worldEngineParams.mouseDrawableShape,
      5,
      8,
      new WorldPosition(-10,-10),
      { restitution: 0.9, isSensor: true },
      this
    );
  }
  public getMouseAnchor(): EngineShape {
    return this.mouseAnchor;
  }

  public createBounds(width:number,height:number,options:any):void {
  }



  public updateFunction()  {
    this.animateCalculate();
    this.animateFinalize();
    for(let i=0;i<this.connectorArray.length;i++)
    {
      let connector = this.connectorArray[i];
      
      for(let j=0;j<connector.getEngineConnectorDefArray().length;j++)
      {
        let connectorDef = connector.getEngineConnectorDefArray()[j];
        //console.log(
        //  "SpringEngine:O1="+connector.getWorldId().id+
        //  ":O2="+connectorDef.engineShape.getWorldId().id
        //);
      connectorDef.connectorPositioner.positionConnectorShape(connector,connectorDef);
      }
    }
  }

  
  
private animateCalculate()
	{
    for(let i=0;i<this.connectorArray.length;i++)
    {
      let connector = this.connectorArray[i];
      connector.processConection();
			}
	}
	
	private animateFinalize()
	{

    for(let i=0;i<this.connectorArray.length;i++)
    {
      let connector = this.connectorArray[i];
      let allShapes = connector.getAllSpringShapes();
      for(let j=0;j<allShapes.length;j++) {
        let shape = allShapes[j];
        //console.log("allShapes.length="+allShapes.length+":j="+j);
        //console.log("           shape="+shape.getWorldId().id);
        this.setNewPosition(shape);
        shape.moveList = new Array<WorldPosition>();
      }
    }
	}

	private setNewPosition(shape:SpringShape)
	{
		if(shape.moveList.length==0)  shape.moveList.push(shape.getWorldPosition());	
		var newPosition = WorldPosition.getAveragePostionFromWorldPositionList(shape.moveList);
		shape.translate(newPosition);
	}
 

  public getSpringShape(worldId:WorldId):SpringShape {
    if(this.springShapes.has(worldId))
      return(this.springShapes.get(worldId)); 
      throw new Error("getSpringShape:shape not found! worldId="+worldId.id);

  }

/**
 *
 *
 * @param {SpringShape} springShape
 * @memberof SpringEngine
 */
public addSpringShape(springShape:SpringShape):void {
    this.springShapes.set(springShape.worldId,springShape);    
  }

  public createConnector(worldId:WorldId,drawableConnector:DrawableConnector,connectorShape:EngineShape,
    engineConnectorDefArray:Array<EngineConnectorDef>,
    options:any):EngineConnector {

      let connectorDefArrayDef:Array<SpringConnectorDef> = new Array<SpringConnectorDef>();
      
      for(let i=0;i<engineConnectorDefArray.length;i++) 
      connectorDefArrayDef.push(new SpringConnectorDef(this,engineConnectorDefArray[i]));
      
      let connector = new SpringConnector(
        worldId,
        drawableConnector,
        connectorShape,
        connectorDefArrayDef,
        options,
        this);
        this.connectorArray.push(connector);
    return(connector);
  }

  public createCircle(
    worldId: WorldId,
    drawable: Drawable,
    radius: number,
    numberOfSides: number,
    worldPosition: WorldPosition,
    options: any
  ): CircleEngineShape {
    let circle: SpringCircle = new SpringCircle(
      worldId,
      drawable,
      radius,
      numberOfSides,
      worldPosition,
      options,
      this
    );

    return circle;
  }

  public createRectangle(
    worldId: WorldId,
    drawable: Drawable,
    width: number,
    height: number,
    worldPosition: WorldPosition,
    options: any
  ): RectangleEngineShape {
    let rectangle = new SpringRectangle(
      worldId,
      drawable,
      width,
      height,
      worldPosition,
      options,
      this
    );
    return rectangle;
  }

  public createTextBox(worldId:WorldId,textDisplayShape:TextDisplayShape,width:number,height:number,worldPosition:WorldPosition,options:any):TextEngineShape {
  //createTextBox(worldId:WorldId,textDisplayShape:TextDisplayShape,width:number,height:number,worldPosition:WorldPosition,options:any):RectangleEngineShape {
    let rectangleText:SpringRectangleText = new SpringRectangleText (
      worldId,
      textDisplayShape,
      width,height,worldPosition,
      options,
      this
    );

    return(rectangleText);
  }

  public createPolygon(
    worldId: WorldId,
    drawable: Drawable,
    numberOfSides: number,
    radius: number,
    worldPosition: WorldPosition,
    options: any
  ): PolygonEngineShape {
    let ploygon = new SpringPolygon(
      worldId,
      drawable,
      numberOfSides,
      radius,
      worldPosition,
      options,
      this
    );

    return ploygon;
  }

  public pointerDownEngineEvent(
    world: World,
    canvasMouse: CanvasMouse,
    event: MouseEvent,
    mouseEventHandler: MouseEventHandler
  ): void {}

  public pointerMoveEngineEvent(
    world: World,
    canvasMouse: CanvasMouse,
    event: MouseEvent,
    mouseEventHandler: MouseEventHandler
  ): void {
    var newPosition = new WorldPosition(
      event.x - canvasMouse.offset.x,
      event.y - canvasMouse.offset.y
    );
    this.mouseAnchor.translate(newPosition);

    if (mouseEventHandler.getCurrentWorldObject() != null) {
      var deltaPosition = mouseEventHandler
        .getMouseStatus()
        .startPosition.getDelta(mouseEventHandler.getMouseStatus().position);

      let newX =
        mouseEventHandler.getMouseStatus().startPosition.x -
        deltaPosition.x +
        mouseEventHandler.getMouseStatus().clickOffset.x;

      let newY =
        mouseEventHandler.getMouseStatus().startPosition.y -
        deltaPosition.y +
        mouseEventHandler.getMouseStatus().clickOffset.y;

      mouseEventHandler
        .getCurrentWorldObject()
        .setWorldPosition(new WorldPosition(newX, newY));
    }
  }

  public pointerUpEngineEvent(
    world: World,
    canvasMouse: CanvasMouse,
    event: MouseEvent,
    mouseEventHandler: MouseEventHandler
  ): void {}

  public get mouseAnchor(): SpringCircle {
    return this._mouseAnchor;
  }

  public set mouseAnchor(value: SpringCircle) {
    this._mouseAnchor = value;
  }

  public get springShapes(): Map<WorldId,SpringShape> {
		return this._springShapes;
	}

	public set springShapes(value: Map<WorldId,SpringShape>) {
		this._springShapes = value;
	}

    /**
     * Getter connectorArray
     * @return {Array<MockConnector>}
     */
	public get connectorArray(): Array<SpringConnector> {
		return this._connectorArray;
	}

    /**
     * Setter connectorArray
     * @param {Array<MockConnector>} value
     */
	public set connectorArray(value: Array<SpringConnector>) {
		this._connectorArray = value;
	}


}
