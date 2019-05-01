import { WorldEngineParams } from "./worldengineparams";

export abstract class WorldEngineBase {    
    public intervalId:any;
    public worldEngineParams:WorldEngineParams;

    public constructor(worldEngineParams:WorldEngineParams) {
        this.worldEngineParams = worldEngineParams;
    }

    public stopEngine():void {
        console.log("clearing for:"+this.intervalId);
        clearInterval(this.intervalId);
      }

    public abstract updateFunction():void;

    public startEngine():void {
        let self = this;
        self.intervalId = setInterval(
            function() { self.updateFunction(); },
            self.worldEngineParams.updateInterval
        );
    }
}