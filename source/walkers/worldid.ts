

export class WorldId {
    private _id:string;

    public constructor(woldObjectId:string) {
        this.id = woldObjectId;
    }

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

}