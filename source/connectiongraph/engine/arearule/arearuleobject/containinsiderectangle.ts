import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { ObjectIsOutsideTrigger } from "../arearuletrigger/objectisoutsidetrigger";
import { DistanceWorldPosition } from "../../../world/distanceworldposition";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { ChildrenHaveTheSameYTrigger } from "../arearuletrigger/childrendhavesameytrigger";

export  class ContainInsideRectangle extends AreaRuleObject {

    private rectangleEngineShape:RectangleEngineShape;
    constructor(worldEngine:WorldEngine,rectangleEngineShape:RectangleEngineShape) {
        super(worldEngine,rectangleEngineShape);
        this.rectangleEngineShape = rectangleEngineShape;
        let self = this;
        this.areaRuleArray.push(
            new AreaRule(
                    new ObjectIsOutsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        if(shape.isSelected()) return;               
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
                        let distance = shape.getWorldPosition().getDistance(averagePos);

                        let span = 0;
                        if(moves.length==1) span = 5;
                        else if(moves.length==2) span = 20;
                        else if(moves.length=3) span = 20;
                        else if(moves.length=4) span = 20;

                        self.addRandomToWorldPosition(moves.length^2,averagePos);

                        
                        let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                            shape.getWorldPosition(),averagePos,distance*0.75,1,worldEngine.worldEngineParams.updateInterval);
                        /*let message = {
                        running:new Date(), 
                        moves:moves,                          
                        distance:distance,
                        averagePos:averagePos
                       };
                       document.getElementById("messages2").innerHTML = JSON.stringify(JSON.stringify(message));
                       */
                       shape.translate(averagePos);               
                    }           
                    ));

                    this.areaRuleArray.push(
                        new AreaRule(
                                new ChildrenHaveTheSameYTrigger(),
                                function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                                {
                                    if(!shape.isSelected())
                                    {
                                        let wantX = new WorldPosition(shape.getWorldPosition().x,areaRuleObject.areaEngineShape.getWorldPosition().y,);
                                        let distance = shape.getWorldPosition().getDistance(wantX);
                                        //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                                
                                        let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                                            shape.getWorldPosition(),wantX,distance*0.75,1,worldEngine.worldEngineParams.updateInterval);
                                        
                                        //self.addRandomToWorldPosition(wantX);
                                        shape.translate(wantX);               
                                    }
                                }
                            )
                    );
    }

    public addRandomToWorldPosition(span:number,worldPosition:WorldPosition):void {
        worldPosition.x = worldPosition.x+ (Math.random()*span) - span/2.0;
        worldPosition.y = worldPosition.y+ (Math.random()*span) - span/2.0;
    }
}