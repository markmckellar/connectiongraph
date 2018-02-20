import { Junction } from "./junction";
import { Destination } from "./destination";
import { Walker } from "./walker";
import { WorldPosition } from "../world/worldposition";
import { Path } from "./path";
import { WalkerEngine } from "./walkerengine";
import { WorldUpdate } from "./worldupdate";
import { WorldUpdateQueue } from "./worldupdatequeue";
import { WorldId } from "../world/worldid";
import { World } from "../world/world";
import { DisplayHolder } from "../display/displayholder";



export class WalkerWorld  extends World {

	private _walkerEngine:WalkerEngine;
	private _junctions : Map<string,Junction>;
	private _destinations : Map<string,Destination>;
	
	private _walkers : Map<string,Walker>;
	private _paths : Map<string,Path>;
	private _worldUpdateQueue: WorldUpdateQueue;
	
	

    public constructor(displayHolder:DisplayHolder,walkerEngine:WalkerEngine) {
		super(displayHolder);
		this.walkers = new Map<string,Walker>();
		this.junctions = new Map<string,Junction>();	
		this.paths = new Map<string,Path>();	
		this.destinations = new Map<string,Destination>();
		this.worldUpdateQueue = new WorldUpdateQueue();
		this.walkerEngine =  walkerEngine;
	}



	public addPath(path:Path):void {
		//console.log("world.addPath:path="+JSON.stringify(path));	
		
		if(!this.hasPath(path.startJunction,path.endJunction))
		{
			//console.log("world.addPath:before::this.paths.keys.length="+this.paths.size);	
			//console.log("wolrd.addPath:adding:"+path.worldId.id);
			this.paths.set(path.worldId.id,path);
			//this.addJunction(path.startJunction);
			this.addJunction(path.endJunction,
				this.walkerEngine.getJunctionPosition(path.startJunction));
			//console.log("world.addPath:after::this.paths.keys.length="+this.paths.size);	
			//console.log("world.addPath:after::hasPath="+this.hasPath(path.startJunction,path.endJunction));	
			
			this.walkerEngine.addPath(this,path);
		}
	}

	public addJunction(junction:Junction,position:WorldPosition):void {
		if(!this.hasJunction(junction.worldId))
		{
			this.junctions.set(junction.worldId.id,junction);
			//this.walkerEngine.addJunction(this,junction,position);
			this.addDestination(junction.defaultDestination);
		}
	}

	public addDestination(destination:Destination):void {
		if(!this.hasJunction(destination.worldId))
		{
			this.destinations.set(destination.worldId.id,destination);
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
		return( this.destinations.has(worldId.id) );
	}

	public hasWalker(worldId:WorldId):boolean{
		return( this.walkers.has(worldId.id) );
	}

	public hasPath(startJunction:Junction,endJunction:Junction):boolean{
		//console.log("world.hasPath:Path.getPathId="+JSON.stringify(Path.getPathId(startJunction,endJunction)));	
		//console.log("world.hasPath="+( this.paths.has(Path.getPathId(startJunction,endJunction).id) ));
		return( this.paths.has(Path.getPathId(startJunction,endJunction).id) );
	}

	public addWorldUpdate(worldUpdate:WorldUpdate):void {
		this.worldUpdateQueue.addToWorldUpdateQueue(worldUpdate);
	}

	public drawWorld():void {
		let walkerWorld = this;
		let context = walkerWorld.displayHolder.get2DGraphicsContext();
		
		this.junctions.forEach((junction: Junction, key: string) => {
			for(let i=0;i<junction.worldObjectDisplayArray.length;i++)
			{
				//console.log("WalkerWorld.drawWorld:junction="+junction.worldId.id+":i="+i+" of "+junction.worldObjectDisplayArray.length);
				
				junction.worldObjectDisplayArray[i].drawObject(walkerWorld,context);
			}
		});
	}

	public processWorldUpdates():void {
		this.worldUpdateQueue.prepareWorldUpdateQueue();
		let isAnimated:boolean = true;
		let checkDate:Date = new Date();
		if(isAnimated) while(this.worldUpdateQueue.isNextWorldUpdateReady(checkDate))
		{
			var worldUpdate:WorldUpdate = this.worldUpdateQueue.processWorldUpdateQueue();
			if(worldUpdate!=null) this.processOneWorldUpdate(worldUpdate);
			
			//console.log("processWorldUpdateList:"+JSON.stringify(worldUpdate))
			/*
			if(proccesed!=null)
			{
				var date = new Date(proccesed.processTimestamp*1000+0*1000);//proccesed.getDate();
			}*/
		}	
	}

	public getNewJunctionPosition():WorldPosition {
		return( new WorldPosition(20,20) );
	}

	
	private processOneWorldUpdate(worldUpdate:WorldUpdate):void {
		

		let junction:Junction = worldUpdate.getJunction(this);
		let walker:Walker = worldUpdate.getWalker(this,junction);
		//console.log("processOneWorldUpdate:junction.woldObjectId="+JSON.stringify(junction.worldId.id));
		//console.log("processOneWorldUpdate:walker.currentJunction.woldObjectId="+
		//	JSON.stringify(walker.getCurrentDestination().getJunction(this).worldId.id));
		// 
		let isCurrentJunction:boolean = (walker.isCurrentJunction(this,junction)); 
		console.log("processOneWorldUpdate:"+
			":junction="+junction.worldId.id+
			":Walker="+walker.worldId.id+
			":isCurrentJunction="+isCurrentJunction+
			"");
		
		if(!isCurrentJunction)
		{			
			let startingJunction = walker.getCurrentJunction(this);
			//let startPosition:WorldPosition = this.walkerEngine.getJunctionPosition(startingJunction);
			//this.walkerEngine.setJunctionPosition(junction,startPosition);
			//console.log("processOneWorldUpdate:startingJunction="+startingJunction.worldId.id);
			//console.log("processOneWorldUpdate:junction="+junction.worldId.id);
			let path:Path = worldUpdate.getPath(this,startingJunction,junction);
			//console.log("processOneWorldUpdate.path="+JSON.stringify(path))
			walker.setCurrentDestination(this,path.endJunction.getWalkerDestination(walker));
			//console.log("processOneWorldUpdate.walker.currentDestination="+JSON.stringify(walker.getCurrentDestination()))	
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


	public get destinations(): Map<string,Destination> {
		return this._destinations;
	}

	public set destinations(value: Map<string,Destination>) {
		this._destinations = value;
	}

}
