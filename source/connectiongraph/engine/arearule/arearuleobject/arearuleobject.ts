import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { WorldEngine } from "../../worldengine";

export class  AreaRuleObject {    
    public worldEngine:WorldEngine;
    public areaEngineShape:EngineShape;
    private engineShapeList:Array<EngineShape>;
    public areaRuleArray:Array<AreaRule>;

    constructor(worldEngine:WorldEngine,areaEngineShape:EngineShape) {
        this.worldEngine = worldEngine;
        this.areaEngineShape = areaEngineShape;
        this.engineShapeList = new Array<EngineShape>();
        this.areaRuleArray = new Array<AreaRule>();
        this.areaEngineShape.removeFromCollisionTags(this.worldEngine.getWorldStructureCollisionTag());

    }

    public addToAffectedShapeList(engineShape:EngineShape) {
        this.engineShapeList.push(engineShape);
        engineShape.addToCollissionTags(this.areaEngineShape.getWorldId().id);
        //engineShape.addToCollissionTags(this.worldEngine.getWorldStructureCollisionTag());

    }
    public removeFromoAfectedShapeList(engineShape:EngineShape) {
        let index = this.engineShapeList.indexOf(engineShape, 0);
        if (index > -1)  this.engineShapeList.splice(index, 1);
        engineShape.removeFromCollisionTags(this.areaEngineShape.getWorldId().id);
        //engineShape.removeFromCollisionTags(this.worldEngine.getWorldStructureCollisionTag());

    }

    public processAllRules() {
        for(let i=0;i<this.areaRuleArray.length;i++){
            let areaRule = this.areaRuleArray[i];
            for(let j=0;j<this.engineShapeList.length;j++) {
                let engineShape = this.engineShapeList[j];
                areaRule.processRule(this,engineShape);
            }
        }
    }

}