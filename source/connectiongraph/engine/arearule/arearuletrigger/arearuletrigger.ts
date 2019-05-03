import { AreaRuleObject } from "../arearuleobject/arearuleobject";
import { EngineShape } from "../../shapes/engineshape";

export interface AreaRuleTrigger {
    fireRuleTrigger(areaRuleObject:AreaRuleObject,shape:EngineShape):boolean;

}