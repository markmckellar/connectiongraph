import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldEngineBase } from "../../worldenginebase";
import { DistanceWorldPosition } from "../../../world/distanceworldposition";


export class PositionerCenterConnectorShape implements ConnectorPositioner {



    constructor() {
    }



    public positionConnectorShape(engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
        let averagePos = EngineConnectorDef.GetAverageConnecterDefPositon(engineConnector.getEngineConnectorDefArray());
        let distanceAvaragePos = DistanceWorldPosition.CreateDistanceWorldPosition(engineConnector.getWorldPosition(),averagePos);

        let movePos = WorldEngineBase.calulateSpringMovement(
            engineConnector,
            averagePos,
            0,
            .1
        );
        let output = {
            "currentPos":engineConnector.getWorldPosition(),
            "distanceAvaragePos:":distanceAvaragePos,
            "movePos":movePos
        };
        //console.log(output);

        //console.log(JSON.stringify(output));

        engineConnector.translate(averagePos);

/*
        if(engineConnectorDef.engineShape.isSelected())
        {
            engineConnector.translate(
                new WorldPosition(
                    engineConnectorDef.engineShape.getWorldPosition().x,
                    engineConnector.getWorldPosition().y)
                );
        }
        else
        {
            engineConnectorDef.engineShape.translate(
                new WorldPosition(
                    engineConnector.getWorldPosition().x,
                    engineConnectorDef.engineShape.getWorldPosition().y)
                );
        }
        */

    }

}