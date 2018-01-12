import { Junction } from "./junction";
import { Walker } from "./walker";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { WorldUpdate } from "./worldupdate";



export class World {
    private _junctionList: Array<Junction>;
	private _walkerList: Array<Walker>;
	private _worldUpdateList: Array<WorldUpdate>;
	private _walkerEngine:WalkerEngine;
	private _junctions : Map<string,Junction>;
	private _walkers : Map<string,Walker>;
	private _paths : Map<string,Path>;
	

    public constructor(walkerEngine:WalkerEngine) {
		this.junctionList = new Array<Junction>();
		this.walkerList = new Array<Walker>();
		this.worldUpdateList = new Array<WorldUpdate>();
		this.walkers = new Map<string,Walker>();
		this.junctions = new Map<string,Junction>();	
		this.paths = new Map<string,Path>();		
		
		this.walkerEngine =  walkerEngine;
	}

	public addPath(path:Path) {
		if(!this.hasPath(path.startJunction,path.endJunctin))
		{
			console.log("world.addPath:before::this.paths.keys.length="+this.paths.size);	
			console.log("wolrd.addPath:adding:"+path.woldObjectId);
			this.paths.set(path.getPathId(),path);
			this.addJunction(path.startJunction);
			this.addJunction(path.endJunctin);
			console.log("world.addPath:after::this.paths.keys.length="+this.paths.size);	
			this.walkerEngine.addPath(this,path);
		}
	}

	public addWalker(walker:Walker) {
		
	}

	public getJunction(woldObjectId:string) : Junction{
		return( this.junctions.get(woldObjectId) );
	}

	public getWalker(woldObjectId:string):Walker{
		return( this.walkers.get(woldObjectId) );
	}

	public getPath(startJunction:Junction,endJunction:Junction):Path{
		return( this.paths.get(Path.getPathId(startJunction,startJunction)) );
	}

	public hasJunction(woldObjectId:string):boolean{
		return( this.junctions.has(woldObjectId) );
	}

	public hasWalker(woldObjectId:string):boolean{
		return( this.walkers.has(woldObjectId) );
	}

	public hasPath(startJunction:Junction,endJunction:Junction):boolean{
		return( this.paths.has(Path.getPathId(startJunction,startJunction)) );
	}


	public addJunction(junction:Junction) {
		if(!this.hasJunction(junction.woldObjectId))
		{
			this.junctions.set(junction.woldObjectId,junction);
			this.walkerEngine.addJunction(this,junction);
		}
	}
		

	
	public processWorldUpdate(worldUpdate:WorldUpdate) {
		let junction:Junction = worldUpdate.getJunction(this);
		let walker:Walker = worldUpdate.getWalker(this,junction);
		if(walker.currentJunction.woldObjectId!==junction.woldObjectId)
		{
			let startingJunction = walker.currentJunction;
			let path:Path = worldUpdate.getPath(this,startingJunction,junction);
			walker.currentJunction = path.endJunctin;	
		}

	}

	public get walkerEngine(): WalkerEngine {
		return this._walkerEngine;
	}

	public set walkerEngine(value: WalkerEngine) {
		this._walkerEngine = value;
	}

	public get junctionList(): Array<Junction> {
		return this._junctionList;
	}

	public set junctionList(value: Array<Junction>) {
		this._junctionList = value;
    }
    
    
	public get walkerList(): Array<Walker> {
		return this._walkerList;
	}

	public set walkerList(value: Array<Walker>) {
		this._walkerList = value;
	}

	public get worldUpdateList(): Array<WorldUpdate> {
		return this._worldUpdateList;
	}

	public set worldUpdateList(value: Array<WorldUpdate>) {
		this._worldUpdateList = value;
	}

	public get walkers(): Map<string,Walker> {
		return this._walkers;
	}

	public set walkers(value: Map<string,Walker>) {
		this._walkers = value;
	}

	public get junctions(): Map<string,Junction> {
		return this._junctions;
	}

	public set junctions(value: Map<string,Junction>) {
		this._junctions = value;
	}

	public get paths(): Map<string,Path> {
		return this._paths;
	}

	public set paths(value: Map<string,Path>) {
		this._paths = value;
	}
}
