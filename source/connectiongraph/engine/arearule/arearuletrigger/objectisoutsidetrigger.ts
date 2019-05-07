import { AreaRuleTrigger } from "./arearuletrigger";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRuleObject } from "../arearuleobject/arearuleobject";

export class ObjectIsOutsideTrigger implements AreaRuleTrigger  {
    public fireRuleTrigger(areaRuleObject:AreaRuleObject,shape:EngineShape):boolean {
        let isInside = areaRuleObject.areaEngineShape.containsEngineShape(shape);
        //if(isInside) document.getElementById("messages1").innerHTML = JSON.stringify(shape.getWorldId().id+" is inisde");
        //else document.getElementById("messages1").innerHTML = JSON.stringify(shape.getWorldId().id+" is NOT inisde");
        return(!isInside);
    }

}