//import { Path } from "./path";
//import { Walker } from "./walker";
import { WorldObject } from "./worldobject";
import { Destination } from "./destination";
import { Walker } from "./walker";
import { WorldId } from "./worldid";



export abstract class Junction extends WorldObject {
   
    private _destinations: Map<WorldId,Destination>;
    private _destinationList: Array<Destination>;
    private _defaultDestination: Destination;

    public constructor(worldId:WorldId) {
        super(worldId);
        this.destinations = new Map<WorldId,Destination>();
        this.destinationList = Array<Destination>();
        this._defaultDestination = this.getNewDefaultDestination();
        this.addDestination(this.getNewDefaultDestination());
    }

    public abstract getNewDefaultDestination() : Destination;

    public get defaultDestination(): Destination {
		return this._defaultDestination;
	}

	public set defaultDestination(value: Destination) {
		this._defaultDestination = value;
	}


    public getWalkerDestination(walker:Walker):Destination {
        let destination = this.defaultDestination;
        // because we add the default we start at 1
        for(let i=1;i<this.destinationList.length;i++)
        {
            if(this.destinationList[0].isDestination(walker))
            {
                destination = this.destinationList[0];
                break;
            }
        }
        return(destination);
    }

    public addDestination(destination:Destination):void{
        if(!this.hasDestination)
        {
            this.destinations.set(destination.worldId,destination);
            this.destinationList.push(destination);
        }
	}

    public hasDestination(worldId:WorldId):boolean{
		return( this.destinations.has(worldId) );
	}

    private get destinations(): Map<WorldId,Destination> {
		return this._destinations;
	}

	private set destinations(value: Map<WorldId,Destination>) {
		this._destinations = value;
    }
    


	private get destinationList(): Array<Destination> {
		return this._destinationList;
	}

	private set destinationList(value: Array<Destination>) {
		this._destinationList = value;
	}

}
