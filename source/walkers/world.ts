import { Junction } from "./junction";
import { Walker } from "./walker";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { WorldUpdate } from "./worldupdate";
import { WorldUpdateQueue } from "./worldupdatequeue";
	


export class World {

	private _walkerEngine:WalkerEngine;
	private _junctions : Map<string,Junction>;
	private _walkers : Map<string,Walker>;
	private _paths : Map<string,Path>;
	private _worldUpdateQueue: WorldUpdateQueue;
	
	

    public constructor(walkerEngine:WalkerEngine) {
		this.walkers = new Map<string,Walker>();
		this.junctions = new Map<string,Junction>();	
		this.paths = new Map<string,Path>();		
		this.worldUpdateQueue = new WorldUpdateQueue();
		this.walkerEngine =  walkerEngine;
	}

	public addPath(path:Path) {
		console.log("world.addPath:path="+JSON.stringify(path));	
		
		if(!this.hasPath(path.startJunction,path.endJunction))
		{
			console.log("world.addPath:before::this.paths.keys.length="+this.paths.size);	
			console.log("wolrd.addPath:adding:"+path.woldObjectId);
			this.paths.set(path.getPathId(),path);
			this.addJunction(path.startJunction);
			this.addJunction(path.endJunction);
			console.log("world.addPath:after::this.paths.keys.length="+this.paths.size);	
			this.walkerEngine.addPath(this,path);
		}
	}

	public addJunction(junction:Junction):void {
		if(!this.hasJunction(junction.woldObjectId))
		{
			this.junctions.set(junction.woldObjectId,junction);
			this.walkerEngine.addJunction(this,junction);
		}
	}

	public addWalker(walker:Walker):void {
		if(!this.hasWalker(walker.woldObjectId))
		{
			this.walkers.set(walker.woldObjectId,walker);
			this.walkerEngine.addWalker(this,walker);
		}
	}

	public getJunction(woldObjectId:string) : Junction{
		return( this.junctions.get(woldObjectId) );
	}

	public getWalker(woldObjectId:string):Walker{
		return( this.walkers.get(woldObjectId) );
	}

	public getPath(startJunction:Junction,endJunction:Junction):Path{
		return( this.paths.get(Path.getPathId(startJunction,endJunction)) );
	}

	public hasJunction(woldObjectId:string):boolean{
		return( this.junctions.has(woldObjectId) );
	}

	public hasWalker(woldObjectId:string):boolean{
		return( this.walkers.has(woldObjectId) );
	}

	public hasPath(startJunction:Junction,endJunction:Junction):boolean{
		console.log("world.hasPath:Path.getPathId="+JSON.stringify(Path.getPathId(startJunction,endJunction)));	
		
		return( this.paths.has(Path.getPathId(startJunction,endJunction)) );
	}

	public addWorldUpdate(worldUpdate:WorldUpdate):void {
		this.worldUpdateQueue.addToWorldUpdateQueue(worldUpdate);
	}

	public processWorldUpdates():void {
		this.worldUpdateQueue.prepareWorldUpdateQueue();
		let isAnimated:boolean = true;
		let checkDate:Date = new Date();
		if(isAnimated) while(this.worldUpdateQueue.isNextWorldUpdateReady(checkDate))
		{
			var worldUpdate:WorldUpdate = this.worldUpdateQueue.processWorldUpdateQueue();
			if(worldUpdate!=null) this.processOneWorldUpdate(worldUpdate);
			
			console.log("processWorldUpdateList:"+JSON.stringify(worldUpdate))
			/*
			if(proccesed!=null)
			{
				var date = new Date(proccesed.processTimestamp*1000+0*1000);//proccesed.getDate();
			}*/
		}	
	}

	
	private processOneWorldUpdate(worldUpdate:WorldUpdate):void {
		let junction:Junction = worldUpdate.getJunction(this);
		let walker:Walker = worldUpdate.getWalker(this,junction);
		console.log("processOneWorldUpdate:junction.woldObjectId"+JSON.stringify(junction.woldObjectId));
		console.log("processOneWorldUpdate:walker.currentJunction.woldObjectId"+
			JSON.stringify(walker.currentJunction.woldObjectId));
		
		if(walker.currentJunction.woldObjectId!==junction.woldObjectId)
		{
			let startingJunction = walker.currentJunction;
			let path:Path = worldUpdate.getPath(this,startingJunction,junction);
			console.log("processOneWorldUpdate:"+JSON.stringify(path))
			
			walker.currentJunction = path.endJunction;	
		}

	}

	public get walkerEngine(): WalkerEngine {
		return this._walkerEngine;
	}

	public set walkerEngine(value: WalkerEngine) {
		this._walkerEngine = value;
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


	public get worldUpdateQueue(): WorldUpdateQueue {
		return this._worldUpdateQueue;
	}

	public set worldUpdateQueue(value: WorldUpdateQueue) {
		this._worldUpdateQueue = value;
	}
}
