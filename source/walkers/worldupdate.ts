import { World } from "./world";
import { Junction } from "./junction";
import { Walker } from "./walker";
import { Path } from "./path";


export class WorldUpdate {
    private _walkerName: string;
    private _processDate: Date;
    private _junctionName: string;
    private _walkerInfo: Object;
    private _junctionInfo: Object;
    private _pathInfo: Object;
    

    public constructor(junctionName:string,walkerName:string,processDate:Date,junctionInfo:Object,walkerInfo:Object,pathInfo:Object){
        this.junctionName = junctionName;
        this.walkerName = walkerName;
        this.processDate = processDate;
        this.walkerInfo = walkerInfo;
        this.junctionInfo = junctionInfo;
        this.pathInfo = pathInfo;
	}
	
	public getJunction(world:World):Junction {
		let junction:Junction = null;
		if(!world.hasJunction(this.junctionName)) {
			junction = new Junction(this.junctionName);
			world.addJunction(junction);
		} 
		junction = world.getJunction(this.junctionName);
		return(junction);
	}

	public getWalker(world:World,junction:Junction):Walker {
		let walker:Walker = null;
		if(!world.hasWalker(this.walkerName)) {
			walker = new Walker(this.walkerName,junction);
			world.addWalker(walker);
		} 
		return(walker);
	}

	public getPath(world:World,startJunction:Junction,endJunction:Junction):Path {
		let path:Path = null;
		if(!world.hasPath(startJunction,endJunction)) {
			path = new Path(startJunction,endJunction);
			world.addPath(path);
		} 
		path = world.getPath(startJunction,endJunction);
		return(path);
	}

    public isReadyToBeProcessed():boolean {
        return( this.processDate.getTime()>=(new Date().getTime()) );
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
    
}