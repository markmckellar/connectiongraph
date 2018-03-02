import { WorldEngine } from "../worldengine";
import { Drawable } from "../../display/drawable";
import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
import { CircleEngineShape } from "../shapes/circleengineshape";
import { RectangleEngineShape } from "../shapes/rectangleengineshape";
import { MockCircle } from "./shapes/mockcircle";
import { MockRectangle } from "./shapes/mockrectangle";
import { MockPolygon } from "./shapes/mockpolygon";

import { PolygonEngineShape } from "../shapes/triangleengineshape";


export class MockEngine implements WorldEngine {

    public createCircle(worldId:WorldId,drawable:Drawable,radius:number,numberOfSides:number,worldPosition:WorldPosition,options:any):CircleEngineShape {
        let circle:MockCircle = new MockCircle(
          worldId,
          drawable,
          radius,numberOfSides,worldPosition,
          options,
          this
        );
        return(circle);  
    }

    public createRectangle(worldId:WorldId,drawable:Drawable,width:number,height:number,worldPosition:WorldPosition,options:any):RectangleEngineShape {
      let rectangle:MockRectangle = new MockRectangle(
        worldId,
        drawable,
        width,height,worldPosition,
        options,
        this
      );
      return(rectangle);
    }
    public createPolygon(worldId:WorldId,drawable:Drawable,numberOfSides:number,radius:number,worldPosition:WorldPosition,options:any):PolygonEngineShape {
      let ploygon:PolygonEngineShape = new MockPolygon(
        worldId,
        drawable,
        numberOfSides,
        radius,
        worldPosition,
        options,
        this); 
      return(ploygon);
    }   
       
}