import { Junction } from "./junction";
import { WorldId } from "./worldid";
import { Destination } from "./destination";
import { DefaultDestination } from "./defaultdestination";
import { WorldObjectDisplay } from "../renderer/worldobjectdisplay";


export class DefaultJunction extends Junction {

    public constructor(worldId:WorldId,worldObjectDisplay:WorldObjectDisplay)  {
        super(worldId,worldObjectDisplay);
    }

    public getNewDefaultDestination() : Destination{
        //console.log("DefaultJunction:"+this.worldId);
        return(new DefaultDestination(new WorldId(this.worldId.id+":defaultDestination"),this,this.worldObjectDisplay));
    }
    

}
