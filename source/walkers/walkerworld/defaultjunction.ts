import { Junction } from "./junction";
import { WorldId } from "../world/worldid";
import { Destination } from "./destination";
import { DefaultDestination } from "./defaultdestination";
import { WorldObjectDisplay } from "../display/worldobjectdisplay";
import { EngineObject } from "../engine/engineobject";


export class DefaultJunction extends Junction {

    public constructor(worldId:WorldId,worldObjectDisplay:WorldObjectDisplay,engineObject:EngineObject)  {
        super(worldId,worldObjectDisplay,engineObject);
    }

    public getNewDefaultDestination() : Destination{
        //console.log("DefaultJunction:"+this.worldId);
        return(new DefaultDestination(new WorldId(this.worldId.id+":defaultDestination"),this,this.worldObjectDisplay));
    }
    

}
