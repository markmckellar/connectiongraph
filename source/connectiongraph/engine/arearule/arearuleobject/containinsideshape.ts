import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { ObjectIsOutsideTrigger } from "../arearuletrigger/objectisoutsidetrigger";
import { PostionIsInsideTrigger } from "../arearuletrigger/positionisinsidetrigger";
import { DistanceWorldPosition } from "../../../world/distanceworldposition";

export  class ContainInsideShape extends AreaRuleObject {

    constructor(worldEngine:WorldEngine,areaEngineShape:EngineShape) {
        super(worldEngine,areaEngineShape);
        this.areaRuleArray.push(
            new AreaRule(
                    //new PostionIsOutsideTrigger(),
                    new ObjectIsOutsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        if(!shape.isSelected())
                        {
                            //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                    
                            let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                                shape.getWorldPosition(),
                                areaRuleObject.areaEngineShape.getWorldPosition(),
                                0,
                                .1,
                                worldEngine.worldEngineParams.updateInterval
                            );
                    
                            shape.translate(movePos);               
                        }
                    }
                )
        );

        this.areaRuleArray.push(
            new AreaRule(
                    //new PostionIsOutsideTrigger(),
                    new PostionIsInsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        if(!shape.isSelected())
                        {
                            ///let nearestPoint = areaRuleObject.areaEngineShape.getShapePoints
                            //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                    
                            let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                                shape.getWorldPosition(),
                                areaRuleObject.areaEngineShape.getWorldPosition(),
                                0,
                                .01,
                                worldEngine.worldEngineParams.updateInterval
                            );
                    
                            shape.translate(movePos);               
                        }
                    }
                )
        );

    }

}