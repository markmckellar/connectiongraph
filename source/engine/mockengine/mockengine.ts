import { WorldEngine } from "../worldengine";
import { Drawable } from "../../display/drawable";
import { WorldId } from "../../world/worldid";
import { WorldPosition } from "../../world/worldposition";
import { CircleEngineShape } from "../shapes/circleengineshape";
import { MockCircle } from "./shapes/mockcircle";



export class MockEngine implements WorldEngine {

    public createCircle(worldId:WorldId,drawable:Drawable,radius:number,numberOfSides:number,worldPosition:WorldPosition,options:any):CircleEngineShape {

      //	constructor(worldId:WorldId,drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition,mockEngine:MockEngine)

        let circle:MockCircle = new MockCircle(
          worldId,
          drawable,
          radius,numberOfSides,worldPosition,
          options,
          this
        );
        return(circle);
  
      }
    
    
};