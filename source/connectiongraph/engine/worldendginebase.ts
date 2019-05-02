import { WorldEngineParams } from "./worldengineparams";
import { WorldObject } from "../world/worldobject";
import { WorldPosition } from "../world/worldposition";
import { DistanceWorldPosition } from "../world/distanceworldposition";

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

    public static calulateSpringMovement(worldObject:WorldObject,connectedToPosition:WorldPosition,conectionLength:number,stiffness:number):DistanceWorldPosition
	{
        //stiffness = 1.0;
        let wantPosition = new DistanceWorldPosition(worldObject.getWorldPosition().x,worldObject.getWorldPosition().y).getDistanceOnLinePointArrayClosest(
                connectedToPosition,
                conectionLength//+randomStrengthFactor*Math.random()
                );
    
        if(wantPosition.distance==0.0) {
            /*
            let output = {
                'NO MOVE shape':shape.getWorldId().id,
                'conectionLength':conectionLength,
                'stiffness':stiffness,
                'current':shape.getWorldPosition(),
                'connectedToPosition':connectedToPosition,
                'wantPosition':wantPosition,
                'distanceToPosition':wantPosition.distance,
            }
            */
            //console.log(JSON.stringify(output));  
            return(wantPosition);
        }
        // stiffness should use the refresh interval somehow to decide how far it moves each "click".. right now it is a default that is the same
        // regardless of the animation interval
        let movePosition = new DistanceWorldPosition(worldObject.getWorldPosition().x,worldObject.getWorldPosition().y).getDistanceOnLinePointArrayClosest(            
            wantPosition,
            wantPosition.distance-(wantPosition.distance*stiffness)
                );

 

        // add this position to the list of points this worldObject needs to move
        // to  
        /*
        let output = {
            'MOVE shape':shape.getWorldId().id,
            'conectionLength':conectionLength,
            'stiffness':stiffness,
            'current':shape.getWorldPosition(),
            'connectedToPosition':connectedToPosition,
            'wantPosition':wantPosition,
            'distanceToPosition':wantPosition.distance,
            'movePosition':movePosition
        }
        */
        //console.log(JSON.stringify(output));              
        return(movePosition);
	}
    
}