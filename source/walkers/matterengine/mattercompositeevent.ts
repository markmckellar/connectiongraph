import { MatterEngine } from "./matterengine";
import { MatterEvent } from "./matterevent";
import * as Matter from "matter-js";


/*
export abstract class MatterCollisionEvent  {

    public abstract processCollisionPairsEvent(matterEngine:MatterEngine,
        eventType:MatterEvent,
        event: Matter.IEventCollision<Matter.Engine>):void;
}
*/
export interface MatterCompositeEvent {
    (matterEngine:MatterEngine,
        eventType:MatterEvent,
        event: Matter.IEventComposite<Matter.Composite>):void;
    }