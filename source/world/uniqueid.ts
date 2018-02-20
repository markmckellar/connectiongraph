export class UniqueId {

    private performanceExists : boolean;

    public constructor() {
        this.performanceExists = false;
        if (typeof performance !== "undefined" && typeof performance.now === "function")
            this.performanceExists = true;
    }

    public generateUUID () : string { 
        let d = (this.performanceExists) ? new Date().getTime() : performance.now();
        
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

}