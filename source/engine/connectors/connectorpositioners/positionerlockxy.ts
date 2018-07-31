import { EngineConnector } from "../engineconnector";
import { EngineConnectorDef } from "../engineconnectordef";
import { ConnectorPositioner } from "./connectorpositioner";
import { WorldPosition } from "../../../world/worldposition";


export class PositionerLockY implements ConnectorPositioner {



    constructor() {
    }

    public positionConnectorShape(engineConnector:EngineConnector,engineConnectorDef:EngineConnectorDef):void {
        if(engineConnectorDef.engineShape.isSelected())
        {
            engineConnector.setWorldPosition(
                new WorldPosition(
                    engineConnector.getWorldPosition().x,
                    engineConnectorDef.engineShape.getWorldPosition().y)
                );
        }
        else
        {
            engineConnectorDef.engineShape.setWorldPosition(
                new WorldPosition(
                    engineConnectorDef.engineShape.getWorldPosition().x,
                    engineConnector.getWorldPosition().y)
                );
        }
    }

}