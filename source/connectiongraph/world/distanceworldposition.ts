import { WorldPosition } from "./worldposition";

export class DistanceWorldPosition extends WorldPosition {
    public distance:number;

    public constructor(x:number,y:number) {
        super(x,y);
	}
	
	public static CreateDistanceWorldPosition(from:WorldPosition,to:WorldPosition):DistanceWorldPosition
	{
		let distanceWorldPosition = new DistanceWorldPosition(to.x,to.y);
		distanceWorldPosition.distance = from.getDistance(to);
		return (distanceWorldPosition);
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


	public getWorldPosition():WorldPosition {
		return(new WorldPosition(this.x,this.y));
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

	public static getClosest(worldDistancePositionList:Array<DistanceWorldPosition>):DistanceWorldPosition {
		let closest:DistanceWorldPosition = null;
		for(let i=0;i<worldDistancePositionList.length;i++)
		{
			if(closest==null) closest = worldDistancePositionList[i];
			else
			{
				if(worldDistancePositionList[i].distance<closest.distance)
					closest = worldDistancePositionList[i];
			}
		}
		return (closest);
	}

	public static getFarthest(worldDistancePositionList:Array<DistanceWorldPosition>):DistanceWorldPosition {
		let farthest:DistanceWorldPosition = null;
		for(let i=0;i<worldDistancePositionList.length;i++)
		{
			if(farthest==null) farthest = worldDistancePositionList[i];
			else
			{
				if(worldDistancePositionList[i].distance>farthest.distance) 
					farthest = worldDistancePositionList[i];
			}
		}
		return (farthest);
	}

	public static getDistanceArray(worldPosition:WorldPosition,worldPositionList:Array<WorldPosition>):Array<DistanceWorldPosition> {
		let distanceList = new Array<DistanceWorldPosition>();
		for(let i=0;i<worldPositionList.length;i++)
		{
			let p = worldPositionList[i];
			let d = worldPosition.getDistance(p);
			let position = new DistanceWorldPosition(p.x, p.y);
			position.distance = d;
			distanceList.push(position);
		}
		return (distanceList);
	}

	public static calulateSpringPositionMovement(worldPosition1:WorldPosition,worldPosition2:WorldPosition,conectionLength:number,stiffness:number,timeInterval:number):DistanceWorldPosition {
		let wantPosition = 
			new DistanceWorldPosition(worldPosition1.x,worldPosition1.y).
				getDistanceOnLinePointArrayClosest(
						worldPosition2,
						conectionLength
				);
	    // we are there, so nothing to do
        if(wantPosition.distance==0.0) {
            return(wantPosition);
		}

        // stiffness should use the refresh interval somehow to decide how far it moves each "click".. right now it is a default that is the same
		// regardless of the animation interval
		let adjsutedStiffness = stiffness;
		let startIncreaseOfStiness = 1.0;
		let increaseBumpAtZero = 0.45;

		if(adjsutedStiffness<startIncreaseOfStiness) {
			adjsutedStiffness =  ( (startIncreaseOfStiness-increaseBumpAtZero)/startIncreaseOfStiness ) * adjsutedStiffness + increaseBumpAtZero;
		}

		let percentToMove = wantPosition.distance * adjsutedStiffness * timeInterval/1000;
		if(percentToMove>0.75) percentToMove = 0.75;
		else if(percentToMove<0) percentToMove = 0;
		
		let movePosition = 
			new DistanceWorldPosition(worldPosition1.x,worldPosition1.y).
					getDistanceOnLinePointArrayClosest(            
            			wantPosition,
            			wantPosition.distance-(wantPosition.distance*percentToMove)
            		);

        /*
        let output = {
            'MOVE shape':shape.getWorldId().id,
            'conectionLength':conectionLength,
            'stiffness':stiffness,
            'current':shape.getWorldPosition(),
            'connectedToPosition':connectedToPosition,
            'wantPosition':wantPosition,
            'distanceToPosition':wantPosition.distance,
            'movePosition':movePosition
        }
        */
        //console.log(JSON.stringify(output));              
        return(movePosition);
	}

}
