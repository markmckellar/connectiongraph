import { WorldPosition } from "./worldposition";

export class DistanceWorldPosition extends WorldPosition {
    public distance:number;

    public constructor(x:number,y:number) {
        super(x,y);
    }

    public getDistanceOnLinePointArray(otherPoint:WorldPosition,distance:number):Array<DistanceWorldPosition>
	{
		let positionList = new Array<DistanceWorldPosition>();
		let modX = 0.0;
		let modY = 0.0;
	
		// what if they are top of each other?
		if (this.getDeltaX(otherPoint) == 0 && this.getDeltaY(otherPoint) == 0)
		{
			modX += Math.random() - 0.5;
			modY += Math.random() - 0.5;
		}
	
		let position = new WorldPosition(otherPoint.x + modX, otherPoint.y + modY);
		let p1:DistanceWorldPosition = null;
		let p2:DistanceWorldPosition = null;
		// this is when the slope is undefined (totally horizontal line)
		if (position.x == this.x) {
			p1 = new DistanceWorldPosition(position.x,position.y+distance);
			p2 = new DistanceWorldPosition(position.x,position.y-distance);
		}
		else {
			// get the equation for the line m=slope b=y-intercept
			let m = this.getDeltaY(position) / this.getDeltaX(position);
			let b = this.y - (m * this.x);
		
			let xPlus = position.x + distance / Math.sqrt(1 + (m * m));
			let xMinus = position.x - distance / Math.sqrt(1 + (m * m));
			let yPlus = xPlus * m + b;
			let yMinus = xMinus * m + b;
		
			p1 = new DistanceWorldPosition(xPlus, yPlus);
			p2 = new DistanceWorldPosition(xMinus, yMinus);
		}

		p1.distance = this.getDistance(p1)
		p2.distance = this.getDistance(p2)

		if(p1.distance<=p2.distance) {
			positionList.push(p1);
			positionList.push(p2);	
		}
		else {
			positionList.push(p2);
			positionList.push(p1);
		}

		/*
		let output = {
			'this':this,
			"otherPoint":otherPoint,
            'positionList':positionList
		}
		*/
        //console.log(JSON.stringify(output)); 
		
		return(positionList);
	}

	public getDistanceOnLinePointArrayClosest(position:WorldPosition,distance:number):DistanceWorldPosition
	{
		let positionList = this.getDistanceOnLinePointArray(position,distance);
		let closest = positionList[0];		
		return (closest);
	}

	public getDistanceOnLinePointArrayFarthest(position:WorldPosition,distance:number):DistanceWorldPosition
	{
		let positionList = this.getDistanceOnLinePointArray(position,distance);
		let farthest = positionList[1];		
		return (farthest);
	}

	public findClosestPostionOnLine(p1:WorldPosition,p2:WorldPosition):WorldPosition
	{
		let A = this.getDeltaX(p1);
		let B = this.getDeltaY(p1);
		let C = p2.getDeltaX(p1);
		let D = p2.getDeltaY(p1);
	
		let dot = A * C + B * D;
		let lengthSquared = C * C + D * D;
		let param = -1;
		if (lengthSquared != 0) //in case of 0 length line
		    param = dot / lengthSquared;
	
		let xx = null
		let yy = null;
	
		if (param < 0)
		{
			xx = p1.x;
			yy = p1.y;
		}
		else if (param > 1) {
			xx = p2.x;
			yy = p2.y;
		}
		else {
			xx = p1.x + param * C;
			yy = p1.y + param * D;
		}
		return(new WorldPosition(xx,yy));
	}

	public getDistancePostionList(positionList:Array<WorldPosition>):Array<DistanceWorldPosition>
	{
		let distanceList = new Array<DistanceWorldPosition>();
		for(let i=0;i<positionList.length;i++)
		{
			let p = positionList[i];
			let d = this.getDistance(p);
			let position = new DistanceWorldPosition(p.x, p.y);
			position.distance = d;
			distanceList.push(position);
		}
		return (distanceList);
	}


}
