import { Junction } from "./junction";
import { WorldId } from "./worldid";
import { Walker } from "./walker";
import { Destination } from "./destination";


export class DefaultDestination extends Destination {

    public constructor(worldId:WorldId,junction:Junction) {
        super(worldId,junction);
    }

    public isDestination(walker:Walker):boolean {
        return(true);
    }

}
