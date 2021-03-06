import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { ObjectIsOutsideTrigger } from "../arearuletrigger/objectisoutsidetrigger";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { ChildrenHaveTheSameYTrigger } from "../arearuletrigger/childrendhavesameytrigger";
import { BoundingBox } from "../../shapes/boundingbox";
import { DistanceWorldPosition } from "../../../world/distanceworldposition";

export  class ContainInsideRectangle extends AreaRuleObject {

    public rectangleEngineShape:RectangleEngineShape;
    constructor(worldEngine:WorldEngine,rectangleEngineShape:RectangleEngineShape) {
        super(worldEngine,rectangleEngineShape);
        this.rectangleEngineShape = rectangleEngineShape;
        let self = this;
        this.areaRuleArray.push(
            new AreaRule(
                    new ObjectIsOutsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        self.rectangleEngineShape.stopRotation();

                        if(shape.isSelected()) return;               
                        document.getElementById("messages1").innerHTML = "START stay in rec";

                        let shapePoints = shape.getShapePoints();
                        let moves = new Array<WorldPosition>();
                        let rect = self.rectangleEngineShape;
                        for(let i=0;i<shapePoints.length;i++) {
                            let point = shapePoints[i];
                            let left = rect.getWorldPosition().x-rect.getWidth()/2.0;
                            let right = rect.getWorldPosition().x+rect.getWidth()/2.0
                            let top = rect.getWorldPosition().y-rect.getHeight()/2.0
                            let bottom = rect.getWorldPosition().y+rect.getHeight()/2.0
                            if(!areaRuleObject.areaEngineShape.containsWorldPosition(point)) {
                                let newPoint = new WorldPosition(0,0);
                               if(point.x<left) newPoint.x = left-point.x;
                               else if(point.x>right) newPoint.x = right-point.x;
                               if(point.y<top) newPoint.y = top-point.y;
                               else if(point.y>bottom) newPoint.y = bottom - point.y;
                                moves.push(newPoint);
                            }
                        }

                        let averageMove = WorldPosition.getAveragePostionFromWorldPositionList(moves);
                        let averagePos = new WorldPosition(shape.getWorldPosition().x+averageMove.x,shape.getWorldPosition().y+averageMove.y);
                        //let distance = shape.getWorldPosition().getDistance(averagePos);
                        /*
                        let span = 0;
                        if(moves.length==1) span = 5;
                        else if(moves.length==2) span = 20;
                        else if(moves.length=3) span = 20;
                        else if(moves.length=4) span = 20;
                        */
                        //self.addRandomToWorldPosition(span,averagePos);

                        
                        //let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                        //    shape.getWorldPosition(),averagePos,distance*0.75,1,worldEngine.worldEngineParams.updateInterval);
                        /*let message = {
                        running:new Date(), 
                        moves:moves,                          
                        distance:distance,
                        averagePos:averagePos
                       };
                       document.getElementById("messages2").innerHTML = JSON.stringify(JSON.stringify(message));
                       */
                      if(averagePos.x>1000||averagePos.x<-1000||averagePos.y>1000||averagePos.y<-1000) {
                        console.log("ObjectIsOutsideTrigger:"+JSON.stringify(
                            {
                                shapeId:shape.getWorldId().id,
                                shapePos:shape.getWorldPosition(),
                                beforeLoop:{x:shape.getWorldPosition().x,y:areaRuleObject.areaEngineShape.getWorldPosition().y},
                                averagePos:averagePos,
                                averageMove:averageMove
                            }
                        ));
                        throw new Error("ObjectIsOutsideTrigger:BIG NUMBER!!!");		
                    }
                    else
                       shape.translate(averagePos);    
                       document.getElementById("messages1").innerHTML = "DONE stay in rec";
           
                    }           
                    ));

                    this.areaRuleArray.push(
                        new AreaRule(
                                new ChildrenHaveTheSameYTrigger(),
                                function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                                {
                                    self.rectangleEngineShape.stopRotation();
                                    if(!shape.isSelected())
                                    {
                                        //document.getElementById("messages2").innerHTML = "START moving to same Y";

                                        let wantPos = new WorldPosition(shape.getWorldPosition().x,areaRuleObject.areaEngineShape.getWorldPosition().y);
                                        //let moveList = new Array<any>();   
                                        // we need to look at all of the other shapes to see if we are "hung up" on one of them...
                                        // if we are then we need to move to one side or the other
                                        for(let i=0;i<areaRuleObject.engineShapeList.length;i++) {
                                            let otherShape = areaRuleObject.engineShapeList[i];
                                            if(!shape.getWorldId().matches(otherShape.getWorldId()))
                                            {
                                                let deltaX = shape.getWorldPosition().x-otherShape.getWorldPosition().x;
                                                let boundingBox = new BoundingBox(shape.getShapePoints());
                                                if(deltaX==0 || Math.abs(deltaX)<(boundingBox.width*0.1)) deltaX = (Math.random()*(boundingBox.width*0.1)) - (boundingBox.width*0.1);
                                                let absDeltaX = Math.abs(deltaX);
                                                let signDeltaX = (deltaX<0) ? -1.0 : 1.0;
                                                if(absDeltaX < boundingBox.width ) {
                                                    let rect = self.rectangleEngineShape;
                                                    let left = rect.getWorldPosition().x-rect.getWidth()/2.0;
                                                    let right = rect.getWorldPosition().x+rect.getWidth()/2.0;
                                                    let moveXPre = boundingBox.width - boundingBox.width/absDeltaX;
                                                    if(Math.abs(moveXPre)>boundingBox.width) moveXPre =  boundingBox.width*signDeltaX;
                                                    let moveX = moveXPre * signDeltaX * 0.5;
                                                    if(wantPos.x>left && wantPos.x<right) wantPos.x = wantPos.x + moveX;
                                                    /*
                                                    moveList.push({
                                                        otherShape:otherShape.getWorldId().id,
                                                        otherX:otherShape.getWorldPosition().x,
                                                        deltaX:deltaX,
                                                        shapeBB:boundingBox.width,
                                                        left:left,
                                                        right:right,
                                                        moveXPre:moveXPre,
                                                        moveX:moveX
                                                    });*/
                                                }                                                
                                            }
                                        }

                                         let distance = shape.getWorldPosition().getDistance(wantPos);
                                        //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                                
                                        let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                                            shape.getWorldPosition(),wantPos,distance*0.75,1,worldEngine.worldEngineParams.updateInterval);
                                        //self.addRandomToWorldPosition(wantX);
/*
                                        if(movePos.x>1000||movePos.x<-1000||movePos.y>1000||movePos.y<-1000) {
                                            console.log("ChildrenHaveTheSameYTrigger:"+JSON.stringify(
                                                {
                                                    shapeId:shape.getWorldId().id,
                                                    shapePos:shape.getWorldPosition(),
                                                    beforeLoop:{x:shape.getWorldPosition().x,y:areaRuleObject.areaEngineShape.getWorldPosition().y},
                                                    wantPos:wantPos,
                                                    movePos:movePos,
                                                    moveList:moveList
                                                }
                                            ));
                                            throw new Error("ChildrenHaveTheSameYTrigger:BIG NUMBER!!!");		
                                        }
                                        else 
                                        {
                                            shape.translate(movePos);               
                                        }
                                        */
                                       shape.translate(movePos);               

                                        //shape.translate(wantPos);               
                                       // document.getElementById("messages2").innerHTML = "DONE moving to same Y";
                                    }
                                }
                            )
                    );
    }

    public addRandomToWorldPosition(span:number,worldPosition:WorldPosition):void {
        worldPosition.x = worldPosition.x+ (Math.random()*span) - span/2.0;
        worldPosition.y = worldPosition.y+ (Math.random()*span) - span/2.0;
    }

    public numberOfAffectedChanged():void {
        let totalLength = 0;
        let maxHeight = 0;
        let averageWidth = 0;
        //let averageHeight = 0;
        for(let i=0;i<this.engineShapeList.length;i++) {
            let bb = new BoundingBox(this.engineShapeList[i].getShapePoints());
            totalLength += bb.width;
            //averageHeight += this.engineShapeList[i].getWorldPosition().x;
            if(bb.height>maxHeight) maxHeight = bb.height;
        }
        averageWidth = totalLength/this.engineShapeList.length;
        //averageHeight = averageHeight/this.engineShapeList.length;        
        if(totalLength==0) totalLength = 1;
        if(maxHeight==0) maxHeight = 1;

        console.log(JSON.stringify({
            totalLength:totalLength,
            maxHeight:maxHeight
        }));
        this.rectangleEngineShape.setSize(
            totalLength+averageWidth*0.5,
            maxHeight+maxHeight*0.5
        );



    }
}