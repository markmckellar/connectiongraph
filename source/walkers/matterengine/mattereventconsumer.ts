
import { MatterEvent } from "./matterevent";
import * as Matter from "matter-js";
import { WorldId } from "../walkerworld/worldid";



export class MatterEventConsumer  {
    private _worldId:WorldId;
    private _body:Matter.Body;
    private _eventType:MatterEvent;
	private _eventHandler:Function;
  
    public constructor(worldId:WorldId,body:Matter.Body,eventType:MatterEvent,eventHandler:Function) {
        this.worldId = worldId;
        this.body = body;
        this.eventType = eventType;
		this.eventHandler = eventHandler;
        //world.addMatterEventConsumer(this);
	}

	public getMapId():string {
		return(MatterEventConsumer.getMapId(this.body,this.eventType));
	}

	public static getMapId(body:Matter.Body,eventType:MatterEvent):string {
		return(body.id+":"+eventType);
	}
	
	
	public get eventHandler(): Function {
		return this._eventHandler;
	}

	public set eventHandler(value: Function) {
		this._eventHandler = value;
	}



	public get worldId(): WorldId {
		return this._worldId;
	}

	public set worldId(value: WorldId) {
		this._worldId = value;
	}


	public get body(): Matter.Body {
		return this._body;
	}

	public set body(value: Matter.Body) {
		this._body = value;
    }
    

	public get eventType(): MatterEvent {
		return this._eventType;
	}

	public set eventType(value: MatterEvent) {
		this._eventType = value;
	}
    

}