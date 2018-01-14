import { Junction } from "./junction";
import { Destination } from "./destination";
import { Walker } from "./walker";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { WorldUpdate } from "./worldupdate";
import { WorldUpdateQueue } from "./worldupdatequeue";
import { WorldId } from "./worldid";



export class World {

	private _walkerEngine:WalkerEngine;
	private _junctions : Map<WorldId,Junction>;
	private _destinations : Map<WorldId,Destination>;
	
	private _walkers : Map<WorldId,Walker>;
	private _paths : Map<WorldId,Path>;
	private _worldUpdateQueue: WorldUpdateQueue;
	
	

    public constructor(walkerEngine:WalkerEngine) {
		this.walkers = new Map<WorldId,Walker>();
		this.junctions = new Map<WorldId,Junction>();	
		this.paths = new Map<WorldId,Path>();		
		this.worldUpdateQueue = new WorldUpdateQueue();
		this.walkerEngine =  walkerEngine;
	}

	public addPath(path:Path) {
		console.log("world.addPath:path="+JSON.stringify(path));	
		
		if(!this.hasPath(path.startJunction,path.endJunction))
		{
			console.log("world.addPath:before::this.paths.keys.length="+this.paths.size);	
			console.log("wolrd.addPath:adding:"+path.worldId.id);
			this.paths.set(path.getPathId(),path);
			this.addJunction(path.startJunction);
			this.addJunction(path.endJunction);
			console.log("world.addPath:after::this.paths.keys.length="+this.paths.size);	
			this.walkerEngine.addPath(this,path);
		}
	}

	public addJunction(junction:Junction):void {
		if(!this.hasJunction(junction.worldId))
		{
			this.junctions.set(junction.worldId,junction);
			this.walkerEngine.addJunction(this,junction);
		}
	}

	public addDestination(destination:Destination):void {
		if(!this.hasJunction(destination.worldId))
		{
			this.destinations.set(destination.worldId,destination);
			this.walkerEngine.addDestination(this,destination);
		}
	}


	public addWalker(walker:Walker):void {
		if(!this.hasWalker(walker.worldId))
		{
			this.walkers.set(walker.worldId,walker);
			this.walkerEngine.addWalker(this,walker);
		}
	}

	public getJunction(worldId:WorldId) : Junction{
		return( this.junctions.get(worldId) );
	}

	public getWalker(worldId:WorldId):Walker{
		return( this.walkers.get(worldId) );
	}

	public getPath(startJunction:Junction,endJunction:Junction):Path{
		return( this.paths.get(Path.getPathId(startJunction,endJunction)) );
	}

	public hasJunction(worldId:WorldId):boolean{
		return( this.junctions.has(worldId) );
	}

	public hasDestination(worldId:WorldId):boolean{
		return( this.destinations.has(worldId) );
	}

	public hasWalker(worldId:WorldId):boolean{
		return( this.walkers.has(worldId) );
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
		console.log("processOneWorldUpdate:junction.woldObjectId"+JSON.stringify(junction.worldId));
		console.log("processOneWorldUpdate:walker.currentJunction.woldObjectId"+
			JSON.stringify(walker.currentDestination.getJunction().worldId));
		
		if(!walker.isCurrentJunction(junction))
		{
			let startingJunction = walker.getCurrentJunction();
			let path:Path = worldUpdate.getPath(this,startingJunction,junction);
			console.log("processOneWorldUpdate:"+JSON.stringify(path))
			
			walker.currentDestination = path.endJunction.getWalkerDestination(walker);	
		}

	}

	public get walkerEngine(): WalkerEngine {
		return this._walkerEngine;
	}

	public set walkerEngine(value: WalkerEngine) {
		this._walkerEngine = value;
	}

	public get walkers(): Map<WorldId,Walker> {
		return this._walkers;
	}

	public set walkers(value: Map<WorldId,Walker>) {
		this._walkers = value;
	}

	public get junctions(): Map<WorldId,Junction> {
		return this._junctions;
	}

	public set junctions(value: Map<WorldId,Junction>) {
		this._junctions = value;
	}

	public get paths(): Map<WorldId,Path> {
		return this._paths;
	}

	public set paths(value: Map<WorldId,Path>) {
		this._paths = value;
	}


	public get worldUpdateQueue(): WorldUpdateQueue {
		return this._worldUpdateQueue;
	}

	public set worldUpdateQueue(value: WorldUpdateQueue) {
		this._worldUpdateQueue = value;
	}


	public get destinations(): Map<WorldId,Destination> {
		return this._destinations;
	}

	public set destinations(value: Map<WorldId,Destination>) {
		this._destinations = value;
	}
}
