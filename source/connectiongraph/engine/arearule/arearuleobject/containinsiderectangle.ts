import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { AreaRule } from "../arearule/arearule";
import { ObjectIsOutsideTrigger } from "../arearuletrigger/objectisoutsidetrigger";
import { PostionIsInsideTrigger } from "../arearuletrigger/positionisinsidetrigger";
import { DistanceWorldPosition } from "../../../world/distanceworldposition";
import { ContainInsideShape } from "./containinsideshape";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";

export  class ContainInsideRectangle extends ContainInsideShape {

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
                                /*
                                if(point.x<left) newPoint.x = left;//moves.push(new WorldPosition(left,point.y));
                                else if(point.x>right) newPoint.x = right; //moves.push(new WorldPosition(right,point.y));
                                if(point.y<top) newPoint.y = top;//moves.push(new WorldPosition(point.x,top));
                                else if(point.y>bottom) newPoint.y = bottom;//moves.push(new WorldPosition(point.x,bottom))
                                */
                               if(point.x<left) newPoint.x = point.x-left;//moves.push(new WorldPosition(left,point.y));
                               else if(point.x>right) newPoint.x = point.x-right; //moves.push(new WorldPosition(right,point.y));
                               if(point.y<top) newPoint.y = point.y-top;//moves.push(new WorldPosition(point.x,top));
                               else if(point.y>bottom) newPoint.y=point.y - bottom;//moves.push(new WorldPosition(point.x,bottom))
                                moves.push(newPoint);
                            }
                            //if(moves.length>0) finalMoves.push( WorldPosition.getAveragePostionFromWorldPositionList(moves) );
                            if(moves.length>0) break;
                        }
                        //let distanceAvaragePos =WorldPosition.getAveragePostionFromWorldPositionList(finalMoves) ;
                        //let distanceAvaragePos = DistanceWorldPosition.getFarthest(
                         //   DistanceWorldPosition.getDistanceArray(
                         //       rect.getWorldPosition(),moves)) ;
                        let averageMove = WorldPosition.getAveragePostionFromWorldPositionList(moves);
                        let averagePos = new WorldPosition(rect.getWorldPosition().x+averageMove.x,rect.getWorldPosition().y+averageMove.y);
                        let distance = rect.getWorldPosition().getDistance(averagePos);
                        let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                            rect.getWorldPosition(),
                            averagePos,//distanceAvaragePos,
                            distance,//distanceAvaragePos.distance,
                            .001,
                            worldEngine.worldEngineParams.updateInterval
                        );                
                        //shape.translate(movePos);               
                    }           ) );

        this.areaRuleArray.push(
            new AreaRule(
                    //new PostionIsOutsideTrigger(),
                    new PostionIsInsideTrigger(),
                    function(areaRuleObject:AreaRuleObject,shape:EngineShape):void
                    {
                        if(!shape.isSelected())
                        {
                            ///let nearestPoint = areaRuleObject.areaEngineShape.getShapePoints
                            //let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);
                    
                            let movePos = DistanceWorldPosition.calulateSpringPositionMovement(
                                shape.getWorldPosition(),
                                areaRuleObject.areaEngineShape.getWorldPosition(),
                                0,
                                .01,
                                worldEngine.worldEngineParams.updateInterval
                            );
                    
                            shape.translate(movePos);               
                        }
                    }
                )
        );

    }

}