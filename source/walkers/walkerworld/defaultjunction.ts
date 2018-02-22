import { Junction } from "./junction";
import { WorldId } from "../../world/worldid";
import { Destination } from "./destination";
import { DefaultDestination } from "./defaultdestination";
import { WorldObject } from "../../world/worldobject";


export class DefaultJunction extends Junction {

    public constructor(junctionWorldObject:WorldObject)  {
        super(junctionWorldObject);
    }

    public getNewDefaultDestination() : Destination{
        //console.log("DefaultJunction:"+this.worldId);
        return(new DefaultDestination(new WorldId(
            this.worldId.id+":defaultDestination"),
            this));
    }
    

}
