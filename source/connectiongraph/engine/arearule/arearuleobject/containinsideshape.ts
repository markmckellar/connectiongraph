import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { PostionIsOutsideTrigger } from "../arearuletrigger/positionisoutsidetrigger";
import { WorldEngineBase } from "../../worldenginebase";

export  class ContainInsideShape extends AreaRuleObject {

    constructor(worldEngine:WorldEngine,areaEngineShape:EngineShape) {
        super(worldEngine,areaEngineShape);
        this.areaRuleArray.push(
            new AreaRule(
                    new PostionIsOutsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                
                        let movePos = WorldEngineBase.calulateSpringMovement(
                            shape,
                            areaRuleObject.areaEngineShape.getWorldPosition(),
                            0,
                            .1,
                            worldEngine.worldEngineParams.updateInterval
                        );
                
                        shape.translate(movePos);               
                    }
                )
        );

    }

}