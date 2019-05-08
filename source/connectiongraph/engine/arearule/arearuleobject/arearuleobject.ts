import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { WorldEngine } from "../../worldengine";

export abstract class AreaRuleObject {    
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

    public abstract numberOfAffectedChanged():void;

    public addListToAffectedShapeList(engineShapeList:Array<EngineShape>) {
        for(let i=0;i<engineShapeList.length;i++) this.addToAffectedShapeList(engineShapeList[i]);
    }

    public removeListFromoAfectedShapeList(engineShapeList:Array<EngineShape>) {
        for(let i=0;i<engineShapeList.length;i++) this.removeFromoAfectedShapeList(engineShapeList[i]);
    }

    public addToAffectedShapeList(engineShape:EngineShape) {
        this.engineShapeList.push(engineShape);
        engineShape.addToCollissionTags(this.areaEngineShape.getWorldId().id);
        this.numberOfAffectedChanged();

    }
    public removeFromoAfectedShapeList(engineShape:EngineShape) {
        let index = this.engineShapeList.indexOf(engineShape, 0);
        if (index > -1)  this.engineShapeList.splice(index, 1);
        engineShape.removeFromCollisionTags(this.areaEngineShape.getWorldId().id);
        this.numberOfAffectedChanged();
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