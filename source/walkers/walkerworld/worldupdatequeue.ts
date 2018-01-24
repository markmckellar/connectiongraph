import { WorldUpdate } from "./worldupdate";


export class WorldUpdateQueue {
    
    private _needsSorting:boolean;
    private _worldUpdateList: Array<WorldUpdate>;
    
    public constructor() {
		this.worldUpdateList = new Array<WorldUpdate>();
    }
    
    public get worldUpdateList(): Array<WorldUpdate> {
		return this._worldUpdateList;
	}

	public set worldUpdateList(value: Array<WorldUpdate>) {
		this._worldUpdateList = value;
    }
    
    public isNextWorldUpdateReady(checkDate:Date):boolean{
		var ready = false;
		if(this.worldUpdateList.length>0)
		{
			ready = this.worldUpdateList[0].isReadyToBeProcessed(checkDate);
		}
		return(ready);
	}
	
	public peekAtNextWorldUpdate():WorldUpdate{
		var worldUpdate:WorldUpdate = null;
		if(this.worldUpdateList.length>0)
		{
			worldUpdate = this.worldUpdateList[0];
		}
		return(worldUpdate);
	}

    public processWorldUpdateQueue():WorldUpdate {
        let worldUpdate:WorldUpdate = this.getNextFromWorldUpdate();
        return(worldUpdate);
    }

    private getNextFromWorldUpdate():WorldUpdate {
        let worldUpdate = null;
        if(this.worldUpdateList.length>0)
        {
            worldUpdate = this.worldUpdateList[0];
            this.worldUpdateList.shift();
        }
        return(worldUpdate);
    }
    
    public addToWorldUpdateQueue(worldUpdate:WorldUpdate):void{
        this.needsSorting = true;
        this.worldUpdateList.push(worldUpdate);
    }	

    public prepareWorldUpdateQueue():void {
        if(this.needsSorting)
        {
            this.worldUpdateList.sort(
                function(a, b):number
                {
                    return(a.processDate.getTime()-b.processDate.getTime());
                });
            this.needsSorting = false;
        }
    }


	private get needsSorting(): boolean {
		return this._needsSorting;
	}

	private set needsSorting(value: boolean) {
		this._needsSorting = value;
	}

}