import { Junction } from "./junction";
import { WorldId } from "../world/worldid";
import { Walker } from "./walker";
import { Destination } from "./destination";
import { WorldObjectDisplay } from "../display/worldobjectdisplay";


export class DefaultDestination extends Destination {

    public constructor(worldId:WorldId,junction:Junction,worldObjectDisplay:WorldObjectDisplay)  {
        super(worldId,junction,worldObjectDisplay);
    }

    public isDestination(walker:Walker):boolean {
        return(true);
    }

}
