import { DebugMessages } from "../util/debugmessages";
import { WorldEngineParams } from "./worldengineparams";
import { EngineConnector } from "./connectors/engineconnector";
import { TickRule } from "./tickrule";
import { EngineShapeBase } from "./shapes/engineshapebase";

export abstract class WorldEngineBase {    
    public intervalId:any;
    public worldEngineParams:WorldEngineParams;
    public connectorArray:Array<EngineConnector>;
    public areaRuleObjectArray:Array<TickRule>;

    public constructor(worldEngineParams:WorldEngineParams) {
        this.worldEngineParams = worldEngineParams;
        this.connectorArray = new Array<EngineConnector>();
        this.areaRuleObjectArray = new Array<TickRule>();
    }

    public stopEngine():void {
        console.log("clearing for:"+this.intervalId);
        clearInterval(this.intervalId);
      }

    public abstract updateFunction():void;

    public getWorldStructureCollisionTag():string {
      return(EngineShapeBase.WorldStructureCollisionTag);
    }

    public startEngine():void {
        let self = this;
        self.intervalId = setInterval(
            function() 
            { 

                DebugMessages.set(3, "START updates");
                let startTime = new Date().getTime();
                DebugMessages.set(3, "START updates:US-");
                self.updateFunction();
                DebugMessages.set(3, "START updates:US-US:R-");
                self.processAreaRuleObjectArray();
                DebugMessages.set(3, "START updates:US-US:R-R:C-");
                self.processConnectorPositionerArray();                                
                let endTime = new Date().getTime()-startTime;
                DebugMessages.set(3, "START updates:US-US:R-R:C-C:endTime="+endTime);
            },
            self.worldEngineParams.updateInterval
        );
    }

    public processAreaRuleObjectArray()  {        
        for(let i=0;i<this.areaRuleObjectArray.length;i++)
        {
          let areaRuleObject = this.areaRuleObjectArray[i];
          areaRuleObject.processAllRules();
        }
      }

    public processConnectorPositionerArray()  {
        for(let i=0;i<this.connectorArray.length;i++)
        {
          let connector = this.connectorArray[i];
          for(let j=0;j<connector.getEngineConnectorDefArray().length;j++)
          {
            let connectorDef = connector.getEngineConnectorDefArray()[j];
            connectorDef.connectorPositioner.positionConnectorShape(this,connector,connectorDef);
          }
        }
      }
}