
export class WorldObject {
	
    private _woldObjectId : string;   
    
    public constructor(woldObjectId:string) {
        this.woldObjectId = woldObjectId;          
    }

    public get woldObjectId(): string {
        return this._woldObjectId;
    }
    
    public set woldObjectId(value: string) {
        this._woldObjectId = value;
    }
}