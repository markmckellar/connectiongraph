import { Junction } from "./junction";
import { Walker } from "./walker";
import { Destination } from "./destination";
import { WorldObject } from "../../world/worldobject";


export class DefaultDestination extends Destination {

    public constructor(destinationWorldObject:WorldObject,junction:Junction)  {
        super(destinationWorldObject,junction);
    }

    public isDestination(walker:Walker):boolean {
        return(true);
    }

}
