import { Junction } from "./junction";
import { WorldId } from "../world/worldid";
import { Walker } from "./walker";
import { Destination } from "./destination";
import { WorldObjectDisplay } from "../display/worldobjectdisplay";
import { EngineObject } from "../engine/engineobject";


export class DefaultDestination extends Destination {

    public constructor(worldId:WorldId,junction:Junction,worldObjectDisplay:WorldObjectDisplay,engineObject:EngineObject)  {
        super(worldId,junction,worldObjectDisplay,engineObject);
    }

    public isDestination(walker:Walker):boolean {
        return(true);
    }

}
