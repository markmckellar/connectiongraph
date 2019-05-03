import { EngineShape } from "../../shapes/engineshape";
import { AreaRuleObject } from "../arearuleobject/arearuleobject";
import { AreaRuleTrigger } from "../arearuletrigger/arearuletrigger";

export class AreaRule {    
    private areaRuleTrigger:AreaRuleTrigger;
    private ruleFunction:(areaRuleObject:AreaRuleObject,shape:EngineShape) => void;

    constructor(areaRuleTrigger:AreaRuleTrigger,ruleFunction:(areaRuleObject:AreaRuleObject,shape:EngineShape) => void) {
        this.ruleFunction = ruleFunction;
        this.areaRuleTrigger = areaRuleTrigger;
    }

    processRule(areaRuleObject:AreaRuleObject,shape:EngineShape):void {
        if(this.areaRuleTrigger.fireRuleTrigger(areaRuleObject,shape)) this.ruleFunction(areaRuleObject,shape);        
    }

}