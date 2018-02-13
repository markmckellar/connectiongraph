import { WalkerWorld } from "./walkerworld";
import { WorldId } from "../world/worldid";
import { Junction } from "./junction";
import { DefaultJunction } from "./defaultjunction";
import { Walker } from "./walker";
import { Path } from "./path";
import { WorldPosition } from "../world/worldposition";
import { WorldObjectDisplayFactory } from "../display/worldobjetdisplayfactory";




export class WorldUpdate {
    private _walkerName: string;
    private _processDate: Date;
    private _junctionName: string;
    private _walkerInfo: Object;
    private _junctionInfo: Object;
	private _pathInfo: Object;
	private _walkerWorldId:WorldId;
	private _junctionWorldId:WorldId;
	
	public constructor(junctionName:string,walkerName:string,processDate:Date,
		junctionInfo:Object,walkerInfo:Object,pathInfo:Object){
        this.junctionName = junctionName;
        this.walkerName = walkerName;
        this.processDate = processDate;
        this.walkerInfo = walkerInfo;
        this.junctionInfo = junctionInfo;
		this.pathInfo = pathInfo;
		
		this._junctionWorldId = new WorldId(this._junctionName);
		this._walkerWorldId = new WorldId(this._walkerName);
	}

	public static datePlus(milliseconds:number):Date {
		let date:Date = new Date();
		date.setMilliseconds(date.getMilliseconds()+milliseconds);
		//console.log("WorldUpdate:datePlus="+date)
		return(date);
	}
	
	
	public getJunction(walkerWorld:WalkerWorld):Junction {
		let junction:Junction = null;
		let updateJunctionExists:boolean = walkerWorld.hasJunction(this.junctionWorldId);
		
		if(!updateJunctionExists) {
			

			let updateWalkerExists:boolean = walkerWorld.hasWalker(this.walkerWorldId);
			let startPosition:WorldPosition = walkerWorld.getNewJunctionPosition();						
			if(updateWalkerExists) startPosition = walkerWorld.walkerEngine.getJunctionPosition(
					walkerWorld.getWalker(this.walkerWorldId).getCurrentJunction(walkerWorld));
			
			junction = new DefaultJunction(
						this.junctionWorldId,
						WorldObjectDisplayFactory.getWorldObjectDisplay("junction",startPosition,walkerWorld),
					);

			walkerWorld.addJunction(junction,startPosition);
		} 
		junction = walkerWorld.getJunction(this.junctionWorldId);
		return(junction);
	}

	public getWalker(walkerWorld:WalkerWorld,junction:Junction):Walker {
		let walker:Walker = null;
		let startPosition:WorldPosition = new WorldPosition(0,0);						

		if(!walkerWorld.hasWalker(this.walkerWorldId)) {
			walker = new Walker(
				this.walkerWorldId,
				junction,
				WorldObjectDisplayFactory.getWorldObjectDisplay("walker",startPosition,walkerWorld)
			);
			walkerWorld.addWalker(walker);
		} 
		walker = walkerWorld.getWalker(this.walkerWorldId);
		return(walker);
	}

	public getPath(walkerWorld:WalkerWorld,startJunction:Junction,endJunction:Junction):Path {
		let path:Path = null;
		let startPosition:WorldPosition = new WorldPosition(0,0);						

		if(!walkerWorld.hasPath(startJunction,endJunction)) {
			path = new Path(
				startJunction,
				endJunction,
				WorldObjectDisplayFactory.getWorldObjectDisplay("path",startPosition,walkerWorld));
			walkerWorld.addPath(path);
		} 
		path = walkerWorld.getPath(startJunction,endJunction);
		//console.log("WorldUpdate:haspath="+world.hasPath(startJunction,endJunction));
		//console.log("WorldUpdate:path="+path);
		//console.log("WorldUpdate:pathjson="+JSON.stringify(path));
		return(path);
	}

    public isReadyToBeProcessed(checkDate:Date):boolean {
        return( this.processDate.getTime()<=(checkDate.getTime()) );
    }

	public get junctionName(): string {
		return this._junctionName;
	}

	public set junctionName(value: string) {
		this._junctionName = value;
	}

	public get walkerName(): string {
		return this._walkerName;
	}


	public get junctionWorldId(): WorldId {
		return this._junctionWorldId;
	}

	public set junctionWorldId(value: WorldId) {
		this._junctionWorldId = value;
	}
	public set walkerName(value: string) {
		this._walkerName = value;
	}

	public get processDate(): Date {
		return this._processDate;
	}

	public set processDate(value: Date) {
		this._processDate = value;
	}
    
	public get walkerInfo(): Object {
		return this._walkerInfo;
	}

	public set walkerInfo(value: Object) {
		this._walkerInfo = value;
	}
    

	public get junctionInfo(): Object {
		return this._junctionInfo;
	}

	public set junctionInfo(value: Object) {
		this._junctionInfo = value;
	}

	public get pathInfo(): Object {
		return this._pathInfo;
	}

	public set pathInfo(value: Object) {
		this._pathInfo = value;
	}


	public get walkerWorldId(): WorldId {
		return this._walkerWorldId;
	}

	public set walkerWorldId(value: WorldId) {
		this._walkerWorldId = value;
	}
	
    
}