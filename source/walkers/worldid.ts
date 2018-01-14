

export class WorldId {
    private _id:String;

    public constructor(woldObjectId:string) {
        this.id = woldObjectId;
    }

	public get id(): String {
		return this._id;
	}

	public set id(value: String) {
		this._id = value;
	}

}