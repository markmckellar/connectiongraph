import * as Matter from "matter-js";
//import { MatterWalkerEngine } from "./matterwalkerengine";
import { WorldPosition } from "../../world/worldposition";

export class MatterTools  {

    public static getLongerLine(p1:Matter.Vector,p2:Matter.Vector):Matter.Vector[] {

        let middleX = (p1.x+p2.x)/2;
        let middleY = (p1.y+p2.y)/2;

        let adjustX = Math.abs(p1.x-middleX);
        let adjustY = Math.abs(p1.y-middleY);
        

        let signX = (p1.x<p2.x) ? 1 : -1;
        let signY = (p1.y<p2.y) ? 1 : -1;

        let n1:Matter.Vector = Matter.Vector.create(
            p1.x-adjustX*signX,
            p1.y-adjustY*signY);

        let n2:Matter.Vector = Matter.Vector.create(
            p2.x+adjustX*signX,
            p2.y+adjustY*signY);
        
        let points:Array<Matter.Vector> = new Array<Matter.Vector>();
        points.push(n1);
        points.push(n2);
        return(points);
    }

    public static bodyPostion2WorldPosition(body:Matter.Body):WorldPosition {
      return( new WorldPosition(body.position.x,body.position.y) );
    }

    public static getColorFromString(colorString:string):string
    {
      if(colorString.length==6)
      {
        colorString += "ff";
      }
      
      let color = "rgba("+
          parseInt(colorString.substring(0,2), 16)+","+
          parseInt(colorString.substring(2,4), 16)+","+
          parseInt(colorString.substring(4,6), 16)+","+
          parseInt(colorString.substring(6,8), 16)/255.0+")";
      
      return(color);
    }

    public static cloneVerticies(inVertices:Array<Matter.Vector>):Array<Matter.Vector>
    {
      let newVeritices:Array<Matter.Vector> = new Array<Matter.Vector>();
      
      for(let x=0;x<inVertices.length;x++)
      {
        let v:Matter.Vector = inVertices[x];
        newVeritices.push(Matter.Vector.create(v.x,v.y));
      }
      return(newVeritices);
    }

    public static getVectorArrayFromWorldPostionOffsetArray(offset:WorldPosition,positionArray:Array<WorldPosition>):Array<Matter.Vector> {
      let newVeritices:Array<Matter.Vector> = new Array<Matter.Vector>();
      for(let i=0;i<positionArray.length;i++) newVeritices.push( 
        this.getVectorFromWorldPostionOffset(offset,positionArray[i]) );
        return(newVeritices);
    }

    public static getVectorFromWorldPostionOffset(offset:WorldPosition,position:WorldPosition):Matter.Vector {
      let newVeritice = Matter.Vector.create(position.x+offset.x,position.y+offset.y) ;
        return(newVeritice);
    }

    public static getWorldPostionArrayFromVectorArray(vectorArray:Array<Matter.Vector>):Array<WorldPosition> {
      let newWorldPositionArray:Array<WorldPosition> = new Array<WorldPosition>();
      for(let i=0;i<vectorArray.length;i++) newWorldPositionArray.push( 
        MatterTools.getWorldPostionFromVector(vectorArray[i]) );
      return(newWorldPositionArray);
    }

    public static getWorldPostionFromVector(vector:Matter.Vector):WorldPosition {
      let worldPosition:WorldPosition = new WorldPosition(vector.x,vector.y) ;
        return(worldPosition);
    }

    public static getVectorFromWorldPostion(position:WorldPosition):Matter.Vector {
      let newVeritice = Matter.Vector.create(position.x,position.y) ;
        return(newVeritice);
    }

    public static getBodyFromWorldPostionArray(location:WorldPosition,positionArray:Array<WorldPosition>):Matter.Body {
      let newVeritices:Array<Matter.Vector> = this.getVectorArrayFromWorldPostionOffsetArray(location,positionArray);
      //let center:Matter.Vector = Matter.Vertices.centre(newVeritices);
      let newBody:Matter.Body = Matter.Bodies.fromVertices(location.x,location.y,[newVeritices]);
      return(newBody);
    }

    /*
    public static getBodyFromWorldShape(location:WorldPosition,shape:WorldShape):Matter.Body {
      let newVeritices:Array<Matter.Vector> = this.getVectorArrayFromWorldPostionOffsetArray(location,shape.shapePoints);
      let newBody:Matter.Body = Matter.Bodies.fromVertices(location.x,location.y,[newVeritices]);
      return(newBody);
    }
    */

    public static createBoundObject(body:Matter.Body,scaleInner:number,scaleOuter:number,options:any):Matter.Body {     
        let pointsInner:Array<Matter.Vector> = this.cloneVerticies(body.vertices);
        Matter.Vertices.scale(pointsInner,scaleInner,scaleInner,body.position);
  
        let pointsOuter:Array<Matter.Vector> = this.cloneVerticies(body.vertices);
        Matter.Vertices.scale(pointsOuter,scaleOuter,scaleOuter,body.position);
       
        let bodies:Array<Matter.Body> = new Array<Matter.Body>();
        
        // go all around the inner
        for(let i=0;i<pointsInner.length;i++)
        {
          let newVeritices:Array<Matter.Vector> = new Array<Matter.Vector>();
          let j = ((i+1)===pointsInner.length) ? 0 : (i+1);
          
          let insidePoints:Matter.Vector[] = this.getLongerLine(pointsInner[i],pointsInner[j]);
          let outsidePoints:Matter.Vector[] = this.getLongerLine(pointsOuter[i],pointsOuter[j]);
          newVeritices.push(insidePoints[0]);
          newVeritices.push(outsidePoints[0]);
          newVeritices.push(outsidePoints[1]);
          newVeritices.push(insidePoints[1]);
          /*
          newVeritices.push(pointsInner[i]);
          newVeritices.push(pointsOuter[i]);
          newVeritices.push(pointsOuter[j]);
          newVeritices.push(pointsInner[j]);
          */     
          //newVeritices.push(pointsInner[i]);
          
          let center:Matter.Vector = Matter.Vertices.centre(newVeritices);
          //options
          let newBody:Matter.Body = Matter.Bodies.fromVertices(center.x,center.y,[newVeritices],
                {render:{fillStyle:"transparent",strokeStyle:"white"}});
           
          bodies.push(newBody);
        }
        options.parts = bodies;
  
        let newBody:Matter.Body = Matter.Body.create(options);        

        newBody.restitution = 1.0; 
        return(newBody);
    }
	
   
    public static findClosestPostionOnLine(p1:Matter.Vector,p2:Matter.Vector):Matter.Vector
	{
		  var A = p1.x-p2.x;
		  var B = p1.x-p2.y;
		  var C = p2.x-p1.x;
		  var D = p2.y-p1.y;
	
		  var dot = A * C + B * D;
		  var lengthSquared = C * C + D * D;
		  var param = -1;
		  if (lengthSquared != 0) //in case of 0 length line
		      param = dot / lengthSquared;
	
		  var xx, yy;
	
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
	/*
		  var dx = x - xx;
		  var dy = y - yy;
		  return Math.sqrt(dx * dx + dy * dy);
		  */
		  return(Matter.Vector.create(xx,yy));
	}
	
}