import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldPosition } from "../../../world/worldposition";
import { WorldEngineBase } from "../../worldendginebase";


export class PositionerCenterConnectorShape implements ConnectorPositioner {



    constructor() {
    }

    public positionConnectorShape(engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
        let allDefPos = new Array<WorldPosition>();
        for(let i=0;i<engineConnector.getEngineConnectorDefArray().length;i++) {
            let ecd = engineConnector.getEngineConnectorDefArray()[i];
            allDefPos.push(ecd.engineShape.getWorldPosition());            
        }
        let avaragePos = WorldPosition.getAveragePostionFromWorldPositionList(allDefPos);
        let distnace = engineConnector.getWorldPosition().getDistance(avaragePos);

        let movePos = WorldEngineBase.calulateSpringMovement(
            engineConnector,
            avaragePos,
            0,
            .01
        );

        engineConnector.translate(movePos);

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