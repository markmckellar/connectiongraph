
export class WorldId {
    private _id:string;

    public constructor(woldObjectId:string) {
        this.id = woldObjectId;
	}
	
	public matches(worldId:WorldId):boolean {
		return(this.id==worldId.id);
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

}