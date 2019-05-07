import { AreaRuleTrigger } from "./arearuletrigger";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRuleObject } from "../arearuleobject/arearuleobject";

export class ChildrenHaveTheSameYTrigger implements AreaRuleTrigger  {
    public fireRuleTrigger(areaRuleObject:AreaRuleObject,shape:EngineShape):boolean {
        //let averagePosition = WorldPosition.getAveragePostionFromWorldObjectList(areaRuleObject.engineShapeList);
        return( shape.getWorldPosition().y!=areaRuleObject.areaEngineShape.getWorldPosition().y) ;
    }

}