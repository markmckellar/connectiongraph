import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { WorldEngine } from "../../worldengine";

export class  AreaRuleObject {    
    public worldEngine:WorldEngine;
    public areaEngineShape:EngineShape;
    public engineShapeList:Array<EngineShape>;
    public areaRuleArray:Array<AreaRule>;

    constructor(worldEngine:WorldEngine,areaEngineShape:EngineShape) {
        this.worldEngine = worldEngine;
        this.areaEngineShape = areaEngineShape;
        this.engineShapeList = new Array<EngineShape>();
        this.areaRuleArray = new Array<AreaRule>();
    }

    public processAllRules() {
        for(let i=0;i<this.areaRuleArray.length;i++){
            let areaRule = this.areaRuleArray[i];
            for(let j=0;i<this.engineShapeList.length;j++) {
                let engineShape = this.engineShapeList[j];
                areaRule.processRule(this,engineShape);
            }
        }
    }

}