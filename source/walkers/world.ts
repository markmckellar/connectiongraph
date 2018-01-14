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
	private _junctions : Map<string,Junction>;
	private _destinations : Map<WorldId,Destination>;
	
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

	public addPath(path:Path):void {
		console.log("world.addPath:path="+JSON.stringify(path));	
		
		if(!this.hasPath(path.startJunction,path.endJunction))
		{
			console.log("world.addPath:before::this.paths.keys.length="+this.paths.size);	
			console.log("wolrd.addPath:adding:"+path.worldId.id);
			this.paths.set(path.worldId.id,path);
			this.addJunction(path.startJunction);
			this.addJunction(path.endJunction);
			console.log("world.addPath:after::this.paths.keys.length="+this.paths.size);	
			console.log("world.addPath:after::hasPath="+this.hasPath(path.startJunction,path.endJunction));	
			
			this.walkerEngine.addPath(this,path);
		}
	}

	public addJunction(junction:Junction):void {
		if(!this.hasJunction(junction.worldId))
		{
			this.junctions.set(junction.worldId.id,junction);
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
			this.walkers.set(walker.worldId.id,walker);
			this.walkerEngine.addWalker(this,walker);
		}
	}

	public getJunction(worldId:WorldId) : Junction{
		return( this.junctions.get(worldId.id) );
	}

	public getWalker(worldId:WorldId):Walker{
		return( this.walkers.get(worldId.id) );
	}

	public getPath(startJunction:Junction,endJunction:Junction):Path{
		return( this.paths.get(Path.getPathId(startJunction,endJunction).id) );
	}

	public hasJunction(worldId:WorldId):boolean{
		return( this.junctions.has(worldId.id) );
	}

	public hasDestination(worldId:WorldId):boolean{
		return( this.destinations.has(worldId) );
	}

	public hasWalker(worldId:WorldId):boolean{
		return( this.walkers.has(worldId.id) );
	}

	public hasPath(startJunction:Junction,endJunction:Junction):boolean{
		console.log("world.hasPath:Path.getPathId="+JSON.stringify(Path.getPathId(startJunction,endJunction)));	
		console.log("world.hasPath="+( this.paths.has(Path.getPathId(startJunction,endJunction).id) ));
		return( this.paths.has(Path.getPathId(startJunction,endJunction).id) );
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
		console.log("processOneWorldUpdate:junction.woldObjectId="+JSON.stringify(junction.worldId.id));
		console.log("processOneWorldUpdate:walker.currentJunction.woldObjectId="+
			JSON.stringify(walker.getCurrentDestination().getJunction(this).worldId.id));
		
		if(!walker.isCurrentJunction(this,junction))
		{
			let startingJunction = walker.getCurrentJunction(this);
			console.log("processOneWorldUpdate:startingJunction="+startingJunction.worldId.id);
			console.log("processOneWorldUpdate:junction="+junction.worldId.id);
			let path:Path = worldUpdate.getPath(this,startingJunction,junction);
			console.log("processOneWorldUpdate.path="+JSON.stringify(path))
			
			walker.setCurrentDestination(this,path.endJunction.getWalkerDestination(walker));
			console.log("processOneWorldUpdate.walker.currentDestination="+JSON.stringify(walker.getCurrentDestination()))
			
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


	public get destinations(): Map<WorldId,Destination> {
		return this._destinations;
	}

	public set destinations(value: Map<WorldId,Destination>) {
		this._destinations = value;
	}
}
